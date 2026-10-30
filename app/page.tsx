"use client";

import React, { useState } from "react";

interface IconProps {
  size?: number;
  className?: string;
}

function Trash2({ size = 24, className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 5v5m4-5v5" />
    </svg>
  );
}

function Download({ size = 24, className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3" />
    </svg>
  );
}

function Search({ size = 24, className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

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
  // Lista inicial com os dados de exemplo que podem ser removidos
  const [veiculos, setVeiculos] = useState<Veiculo[]>([
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

  // Função para remover um veículo da lista
  const removerVeiculo = (id: string) => {
    setVeiculos(veiculos.filter((item) => item.id !== id));
  };

  // Cálculos dinâmicos dos cards
  const totalGasto = veiculos.reduce((acc, item) => acc + item.valorTotal, 0);
  const totalLitros = veiculos.reduce((acc, item) => acc + item.litros, 0);
  const totalKmRodados = veiculos.reduce((acc, item) => acc + item.kmRodados, 0);

  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sistema de Frota & Combustível MCT</h1>
          <p className="text-gray-400 text-sm">Consolidação de Quilometragem e Prestação de Contas para o TCE</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <Download size={18} />
          Exportar Relatório TCE (.CSV)
        </button>
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
        {/* Formulário de Cadastro */}
        <div className="bg-[#1c2541] p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-bold mb-4">Lançar Leitura do Painel</h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Placa do Veículo</label>
              <input type="text" placeholder="EX: RSN4A78" className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm" />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Modelo / Veículo</label>
              <input type="text" placeholder="EX: FIAT MOBI LIKE" className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm" />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Secretaria</label>
              <select className="w-full bg-[#0b132b] border border-gray-700 rounded-lg p-2.5 text-sm">
                <option value="SAÚDE">SAÚDE</option>
                <option value="EDUCAÇÃO">EDUCAÇÃO</option>
                <option value="INFRAESTRUTURA">INFRAESTRUTURA</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-medium py-2.5 rounded-lg transition mt-4">
              + Adicionar Lançamento
            </button>
          </form>
        </div>

        {/* Tabela com opção de Excluir */}
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
                  const media = (v.kmRodados / v.litros).toFixed(1);

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