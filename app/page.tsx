'use client';

import { useState } from 'react';

// Tipos para o sistema
interface Veiculo {
  placa: string;
  modelo: string;
  secretaria: string;
  kmInicial: number;
  kmTripPainel: number;
  litrosAbastecidos: number;
  valorTotalGasto: number;
}

export default function Home() {
  // Lista inicial com o veículo das fotos/planilha como exemplo
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
    {
      placa: 'RSN4A78',
      modelo: 'FIAT MOBI LIKE',
      secretaria: 'SAÚDE',
      kmInicial: 155353,
      kmTripPainel: 2186.8,
      litrosAbastecidos: 54.0,
      valorTotalGasto: 281.11,
    },
    {
      placa: 'SCR8D25',
      modelo: 'AMBULÂNCIA MERCEDES',
      secretaria: 'SAÚDE',
      kmInicial: 186509,
      kmTripPainel: 7184.0,
      litrosAbastecidos: 220.0,
      valorTotalGasto: 1450.00,
    },
  ]);

  // Estados do Formulário
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [secretaria, setSecretaria] = useState('SAÚDE');
  const [kmInicial, setKmInicial] = useState('');
  const [kmTripPainel, setKmTripPainel] = useState('');
  const [litros, setLitros] = useState('');
  const [valorGasto, setValorGasto] = useState('');
  const [busca, setBusca] = useState('');

  // Adicionar novo veículo/lançamento
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !kmInicial || !kmTripPainel) return;

    const novoVeiculo: Veiculo = {
      placa: placa.toUpperCase(),
      modelo: modelo.toUpperCase() || 'VEÍCULO MUNICIPAL',
      secretaria,
      kmInicial: Number(kmInicial),
      kmTripPainel: Number(kmTripPainel),
      litrosAbastecidos: Number(litros) || 0,
      valorTotalGasto: Number(valorGasto) || 0,
    };

    setVeiculos([...veiculos, novoVeiculo]);

    // Limpar formulário
    setPlaca('');
    setModelo('');
    setKmInicial('');
    setKmTripPainel('');
    setLitros('');
    setValorGasto('');
  };

  // Cálculos consolidados da frota
  const totalGastoFrota = veiculos.reduce((acc, v) => acc + v.valorTotalGasto, 0);
  const totalLitrosFrota = veiculos.reduce((acc, v) => acc + v.litrosAbastecidos, 0);
  const totalKmRodadosFrota = veiculos.reduce((acc, v) => acc + v.kmTripPainel, 0);

  // Filtragem na busca
  const veiculosFiltrados = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.secretaria.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase())
  );

  // Exportar Tabela para CSV (Padrão TCE)
  const exportarCSV = () => {
    const cabecalho = 'PLACA;MODELO;SECRETARIA;KM_INICIAL;KM_FINAL;KM_RODADOS;LITROS;VALOR_GASTO;MEDIA_KM_L\n';
    const linhas = veiculos
      .map((v) => {
        const kmFinal = v.kmInicial + v.kmTripPainel;
        const media = v.litrosAbastecidos > 0 ? (v.kmTripPainel / v.litrosAbastecidos).toFixed(2) : '0';
        return `${v.placa};${v.modelo};${v.secretaria};${v.kmInicial};${kmFinal};${v.kmTripPainel};${v.litrosAbastecidos};${v.valorTotalGasto};${media}`;
      })
      .join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RELATORIO_TCE_COMBUSTIVEL.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Sistema de Frota & Combustível MCT
            </h1>
            <p className="text-gray-400 mt-1">
              Consolidação de Quilometragem e Prestação de Contas para o TCE
            </p>
          </div>
          <button
            onClick={exportarCSV}
            className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition duration-200"
          >
            📥 Exportar Relatório TCE (.CSV)
          </button>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Gasto no Mês</span>
            <p className="text-3xl font-extrabold text-emerald-400 mt-2">
              R$ {totalGastoFrota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Combustível Consumido</span>
            <p className="text-3xl font-extrabold text-blue-400 mt-2">
              {totalLitrosFrota.toFixed(1)} <span className="text-xl font-normal text-gray-300">Litros</span>
            </p>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quilometragem Total Rodada</span>
            <p className="text-3xl font-extrabold text-purple-400 mt-2">
              {totalKmRodadosFrota.toLocaleString('pt-BR')} <span className="text-xl font-normal text-gray-300">km</span>
            </p>
          </div>
        </div>

        {/* Formulário + Tabela */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form de Lançamento */}
          <div className="bg-gray-800/80 border border-gray-700 p-6 rounded-xl h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Lançar Leitura do Painel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Placa do Veículo</label>
                <input
                  type="text"
                  placeholder="EX: RSN4A78"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Modelo / Veículo</label>
                <input
                  type="text"
                  placeholder="EX: FIAT MOBI LIKE"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Secretaria</label>
                <select
                  value={secretaria}
                  onChange={(e) => setSecretaria(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="SAÚDE">SAÚDE</option>
                  <option value="EDUCAÇÃO">EDUCAÇÃO</option>
                  <option value="ADMINISTRAÇÃO">ADMINISTRAÇÃO</option>
                  <option value="OBRAS E INFRAESTRUTURA">OBRAS E INFRAESTRUTURA</option>
                  <option value="MEIO AMBIENTE">MEIO AMBIENTE</option>
                  <option value="ESPORTES">ESPORTES</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">KM Inicial (Mês)</label>
                  <input
                    type="number"
                    placeholder="155353"
                    value={kmInicial}
                    onChange={(e) => setKmInicial(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">KM Rodados (Painel/Trip)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="2186.8"
                    value={kmTripPainel}
                    onChange={(e) => setKmTripPainel(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Preview Automático do KM Final */}
              {kmInicial && kmTripPainel && (
                <div className="bg-blue-950/40 border border-blue-800/50 p-3 rounded-lg text-xs text-blue-300">
                  <p><strong>KM Final Calculado:</strong> {(Number(kmInicial) + Number(kmTripPainel)).toFixed(1)} km</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Litros Abastecidos</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="54.0"
                    value={litros}
                    onChange={(e) => setLitros(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="281.11"
                    value={valorGasto}
                    onChange={(e) => setValorGasto(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition duration-200 mt-2"
              >
                + Adicionar Lançamento
              </button>
            </form>
          </div>

          {/* Tabela de Resultados */}
          <div className="lg:col-span-2 bg-gray-800/80 border border-gray-700 p-6 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">Consolidação de Veículos (TCE)</h2>
              <input
                type="text"
                placeholder="🔍 Buscar por placa, secretaria ou modelo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full sm:w-72"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-900/80 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-700">
                  <tr>
                    <th className="py-3 px-3">Placa / Modelo</th>
                    <th className="py-3 px-3">Secretaria</th>
                    <th className="py-3 px-3">KM Inicial</th>
                    <th className="py-3 px-3">KM Final</th>
                    <th className="py-3 px-3">KM Rodados</th>
                    <th className="py-3 px-3">Abastecimento</th>
                    <th className="py-3 px-3">Média</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {veiculosFiltrados.map((v, idx) => {
                    const kmFinal = v.kmInicial + v.kmTripPainel;
                    const media = v.litrosAbastecidos > 0 ? (v.kmTripPainel / v.litrosAbastecidos).toFixed(1) : '0';

                    return (
                      <tr key={idx} className="hover:bg-gray-700/30 transition">
                        <td className="py-3 px-3">
                          <span className="font-bold text-white block">{v.placa}</span>
                          <span className="text-xs text-gray-400">{v.modelo}</span>
                        </td>
                        <td className="py-3 px-3 text-xs">{v.secretaria}</td>
                        <td className="py-3 px-3">{v.kmInicial.toLocaleString()}</td>
                        <td className="py-3 px-3 font-semibold text-emerald-400">{kmFinal.toLocaleString()}</td>
                        <td className="py-3 px-3">{v.kmTripPainel.toLocaleString()} km</td>
                        <td className="py-3 px-3">
                          <span className="block font-medium text-white">{v.litrosAbastecidos} L</span>
                          <span className="text-xs text-gray-400">R$ {v.valorTotalGasto.toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-block bg-blue-900/50 border border-blue-700/50 text-blue-300 px-2 py-0.5 rounded text-xs font-semibold">
                            {media} km/L
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}