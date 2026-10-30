"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Download, Search, Lock, User, LogOut, Plus } from "lucide-react";

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  secretaria: string;
  kmInicial: number;
  kmRodados: number;
  litros: number;
  valorTotal: number;
}

export default function Home() {
  // Estado de Autenticação
  const [autenticado, setAutenticado] = useState(false);
  const [usuarioInput, setUsuarioInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [erroAuth, setErroAuth] = useState("");

  // Estados do Formulário de Lançamento
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [secretaria, setSecretaria] = useState("SAÚDE");
  const [kmInicial, setKmInicial] = useState("");
  const [kmRodados, setKmRodados] = useState("");
  const [litros, setLitros] = useState("");
  const [valorTotal, setValorTotal] = useState("");

  // Lista de veículos (inicialmente vazia até carregar do localStorage)
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [carregado, setCarregado] = useState(false);

  // 1. Carregar os dados salvos no localStorage ao iniciar
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("mct_frota_veiculos");
    if (dadosSalvos) {
      try {
        setVeiculos(JSON.parse(dadosSalvos));
      } catch (e) {
        console.error("Erro ao carregar dados do localStorage", e);
      }
    } else {
      // Exemplo padrão se o localStorage estiver limpo
      setVeiculos([
        {
          id: "1",
          placa: "RSN4A78",
          modelo: "FIAT MOBI LIKE",
          secretaria: "SAÚDE",
          kmInicial: 155353,
          kmRodados: 2186.8,
          litros: 54.0,
          valorTotal: 281.11,
        },
        {
          id: "2",
          placa: "SCR8D25",
          modelo: "AMBULÂNCIA MERCEDES",
          secretaria: "SAÚDE",
          kmInicial: 186509,
          kmRodados: 7184,
          litros: 220.0,
          valorTotal: 1450.0,
        },
      ]);
    }
    setCarregado(true);
  }, []);

  // 2. Salvar automaticamente no localStorage sempre que 'veiculos' for alterado
  useEffect(() => {
    if (carregado) {
      localStorage.setItem("mct_frota_veiculos", JSON.stringify(veiculos));
    }
  }, [veiculos, carregado]);

  // Função de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarioInput === "MCT2026" && senhaInput === "Mct2026@") {
      setAutenticado(true);
      setErroAuth("");
    } else {
      setErroAuth("Usuário ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    setUsuarioInput("");
    setSenhaInput("");
  };

  // Adicionar novo lançamento
  const adicionarVeiculo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !modelo) return;

    const novoVeiculo: Veiculo = {
      id: Date.now().toString(),
      placa: placa.toUpperCase(),
      modelo: modelo.toUpperCase(),
      secretaria,
      kmInicial: Number(kmInicial) || 0,
      kmRodados: Number(kmRodados) || 0,
      litros: Number(litros) || 0,
      valorTotal: Number(valorTotal) || 0,
    };

    setVeiculos([...veiculos, novoVeiculo]);

    // Limpar formulário
    setPlaca("");
    setModelo("");
    setKmInicial("");
    setKmRodados("");
    setLitros("");
    setValorTotal("");
  };

  // Remover veículo
  const removerVeiculo = (id: string) => {
    setVeiculos(veiculos.filter((item) => item.id !== id));
  };

  // Métricas
  const totalGasto = veiculos.reduce((acc, item) => acc + item.valorTotal, 0);
  const totalLitros = veiculos.reduce((acc, item) => acc + item.litros, 0);
  const totalKmRodados = veiculos.reduce((acc, item) => acc + item.kmRodados, 0);

  // --- TELA DE LOGIN ---
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-white flex items-center justify-center p-4 font-sans">
        <div className="bg-[#1c2541] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
          <div className="text-center mb-6">
            <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-400">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold">Acesso ao Sistema</h1>
            <p className="text-gray-400 text-xs mt-1">Frota & Combustível MCT</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Informe o usuário"
                  value={usuarioInput}
                  onChange={(e) => setUsuarioInput(e.target.value)}
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="password"
                  placeholder="Informe a senha"
                  value={senhaInput}
                  onChange={(e) => setSenhaInput(e.target.value)}
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {erroAuth && (
              <p className="text-red-400 text-xs text-center font-medium bg-red-950/40 py-2 rounded-lg border border-red-900/50">
                {erroAuth}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 font-medium py-2.5 rounded-lg transition mt-2 text-sm shadow-lg shadow-blue-600/20"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PRINCIPAL ---
  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Frota & Combustível MCT</h1>
          <p className="text-gray-400 text-sm">Consolidação de Quilometragem e Prestação de Contas para o TCE</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm">
            <Download size={18} />
            Exportar Relatório TCE (.CSV)
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-900/40 hover:bg-red-800/60 text-red-300 font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition text-sm border border-red-800/50"
            title="Sair do Sistema"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1c2541] p-5 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Gasto no Mês</span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {totalGasto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-[#1c2541] p-5 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Combustível Consumido</span>
          <p className="text-2xl font-bold text-blue-400 mt-2">
            {totalLitros.toFixed(1)} <span className="text-base font-normal">Litros</span>
          </p>
        </div>

        <div className="bg-[#1c2541] p-5 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Quilometragem Total Rodada</span>
          <p className="text-2xl font-bold text-purple-400 mt-2">
            {totalKmRodados.toLocaleString("pt-BR")} <span className="text-base font-normal">km</span>
          </p>
        </div>
      </div>

      {/* Formulário e Tabela */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-bold mb-4">Lançar Leitura do Painel</h2>
          <form className="space-y-4" onSubmit={adicionarVeiculo}>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Placa do Veículo</label>
              <input
                type="text"
                placeholder="EX: RSN4A78"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Modelo / Veículo</label>
              <input
                type="text"
                placeholder="EX: FIAT MOBI LIKE"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Secretaria</label>
              <select
                value={secretaria}
                onChange={(e) => setSecretaria(e.target.value)}
                className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
              >
                <option value="SAÚDE">SAÚDE</option>
                <option value="EDUCAÇÃO">EDUCAÇÃO</option>
                <option value="INFRAESTRUTURA">INFRAESTRUTURA</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">KM Inicial</label>
                <input
                  type="number"
                  placeholder="0"
                  value={kmInicial}
                  onChange={(e) => setKmInicial(e.target.value)}
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">KM Rodados</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={kmRodados}
                  onChange={(e) => setKmRodados(e.target.value)}
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Litros</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={litros}
                  onChange={(e) => setLitros(e.target.value)}
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 font-medium py-2.5 rounded-lg transition mt-4 flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={18} />
              Adicionar Lançamento
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Consolidação de Veículos (TCE)</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar por placa, secretaria ou modelo"
                className="bg-[#0b132b] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-xs w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b132b] text-gray-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Placa / Modelo</th>
                  <th className="p-3">Secretaria</th>
                  <th className="p-3">KM Inicial</th>
                  <th className="p-3">KM Final</th>
                  <th className="p-3">KM Rodados</th>
                  <th className="p-3">Abastecimento</th>
                  <th className="p-3">Média</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {veiculos.map((v) => {
                  const kmFinal = v.kmInicial + v.kmRodados;
                  const media = v.litros > 0 ? (v.kmRodados / v.litros).toFixed(1) : "0.0";

                  return (
                    <tr key={v.id} className="hover:bg-[#131c38] transition">
                      <td className="p-3">
                        <div className="font-bold text-white">{v.placa}</div>
                        <div className="text-[10px] text-gray-400">{v.modelo}</div>
                      </td>
                      <td className="p-3 text-gray-300">{v.secretaria}</td>
                      <td className="p-3 text-gray-300">{v.kmInicial.toLocaleString("pt-BR")}</td>
                      <td className="p-3 font-semibold text-emerald-400">{kmFinal.toLocaleString("pt-BR")}</td>
                      <td className="p-3 text-gray-300">{v.kmRodados.toLocaleString("pt-BR")} km</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{v.litros} L</div>
                        <div className="text-[10px] text-gray-400">R$ {v.valorTotal.toFixed(2)}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-900/60 text-blue-300 px-2 py-1 rounded font-semibold text-[11px]">
                          {media} km/L
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => removerVeiculo(v.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/40 p-2 rounded-lg transition"
                          title="Remover Veículo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {veiculos.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      Nenhum veículo cadastrado na lista.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}