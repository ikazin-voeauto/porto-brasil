
import React, { useState } from 'react';
import { ProductionCell } from '../types';
import ReportFaultModal from './ReportFaultModal';

interface CellDetailProps {
  cell: ProductionCell;
  onClose: () => void;
}

type TabType = 'OVERVIEW' | 'PRODUCTION' | 'FAULTS';

const CellDetail: React.FC<CellDetailProps> = ({ cell, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const metrics = [
    { label: 'Disponibilidade', value: `${cell.availability}%` },
    { label: 'Performance', value: `${cell.performance}%` },
    { label: 'Qualidade', value: `${cell.quality}%` },
    { label: 'OEE Final', value: `${cell.oee}%`, highlight: true },
  ];

  const renderOverview = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className={`${m.highlight ? 'bg-zinc-900 text-gold shadow-lg shadow-gold/10' : 'bg-gray-50 text-black border border-gray-100'} p-5 rounded-2xl flex flex-col justify-between h-28 transition-transform hover:scale-[1.02]`}>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${m.highlight ? 'opacity-60' : 'text-gray-400'}`}>{m.label}</span>
            <span className="text-3xl font-luxury">{m.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-6 flex items-center">
          <svg className="w-3 h-3 mr-2 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Sensores em Tempo Real
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          {[
            { name: 'Temperatura da Câmara', val: `${cell.temperature.toFixed(1)} °C`, ok: true },
            { name: 'Vibração Axial', val: `${cell.vibration.toFixed(3)} mm/s`, ok: cell.vibration < 0.15 },
            { name: 'Pressão Hidráulica', val: '4.2 bar', ok: true },
            { name: 'Consumo (kW)', val: '12.4', ok: true },
          ].map((s, i) => (
            <div key={i} className="flex justify-between items-center group">
              <span className="text-xs text-gray-500 font-medium group-hover:text-black transition-colors">{s.name}</span>
              <div className="text-right">
                <p className={`font-luxury text-sm ${s.ok ? 'text-black' : 'text-red-500'}`}>{s.val}</p>
                <div className={`h-1 w-8 rounded-full ml-auto mt-1 ${s.ok ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProduction = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-luxury text-xl mb-1">{cell.currentProduct}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Ordem de Produção: OP-2024-0089</p>
          </div>
          <span className="bg-gold/10 text-gold px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Lote Ativo</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Progresso da Meta</span>
            <span className="text-xl font-luxury">{Math.round((cell.unitsProduced / cell.targetUnits) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
            <div 
              className="h-full bg-black transition-all duration-1000 ease-out"
              style={{ width: `${(cell.unitsProduced / cell.targetUnits) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <span>{cell.unitsProduced.toLocaleString()} Peças</span>
            <span>Meta: {cell.targetUnits.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
          <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-2">Peças Boas</p>
          <p className="text-3xl font-luxury text-green-700">{cell.goodPieces.toLocaleString()}</p>
        </div>
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
          <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-2">Refugo</p>
          <p className="text-3xl font-luxury text-red-700">{cell.badPieces.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  const renderFaults = () => (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Histórico Recente</h3>
        <button className="text-[10px] font-bold text-gold uppercase underline tracking-widest">Ver Log Completo</button>
      </div>
      
      {cell.lastFault ? (
        <div className="space-y-3">
          {[
            { time: '12:45', type: 'Crítica', msg: cell.lastFault, code: 'E-042' },
            { time: '10:20', type: 'Advertência', msg: 'Variação de pressão no atuador 4', code: 'W-015' },
            { time: 'Ontem', type: 'Manutenção', msg: 'Troca preventiva de vedação', code: 'M-102' },
          ].map((f, i) => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${f.type === 'Crítica' ? 'bg-red-500' : f.type === 'Advertência' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-black">{f.msg}</p>
                  <span className="text-[10px] font-mono text-zinc-400">{f.code}</span>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-tighter mt-1">{f.type} • {f.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-xs text-gray-400 font-medium">Nenhuma ocorrência registrada nas últimas 48h.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl relative overflow-hidden animate-slideUp flex flex-col md:flex-row h-[90vh] md:h-auto">
        {/* Left Side: Identity & Status */}
        <div className="w-full md:w-80 bg-black text-white p-10 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 border-2 border-gold rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-gold/20">
              <span className="font-luxury text-4xl text-gold">{cell.id}</span>
            </div>
            <h2 className="text-3xl font-luxury mb-2 tracking-wide">{cell.name}</h2>
            <div className="flex items-center space-x-2 mb-8">
              <div className={`w-2 h-2 rounded-full ${cell.status === 'OPERATIONAL' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${cell.status === 'OPERATIONAL' ? 'text-green-500' : 'text-red-500'}`}>
                {cell.status === 'OPERATIONAL' ? 'Operação Normal' : 'Célula Interrompida'}
              </span>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/10">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Informações Técnicas</p>
              <div className="text-xs space-y-2">
                <div className="flex justify-between"><span className="text-zinc-500">Localização:</span><span className="font-medium text-zinc-300">Pavilhão C - Ala 2</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Firmware:</span><span className="font-medium text-zinc-300">v4.2.1-lux</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Última Ref.:</span><span className="font-medium text-zinc-300">12:04:22</span></div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="w-full py-4 mt-12 bg-zinc-800 text-gold font-bold uppercase tracking-widest text-[10px] rounded-xl border border-gold/20 hover:bg-gold hover:text-black transition-all"
          >
            Reportar Falha
          </button>
        </div>

        {/* Right Side: Tabbed Content */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[#F9F9F7]">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-zinc-300 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200 mb-8">
            {[
              { id: 'OVERVIEW', label: 'Visão Geral' },
              { id: 'PRODUCTION', label: 'Produção' },
              { id: 'FAULTS', label: 'Falhas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`pb-4 text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative ${
                  activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-zinc-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold animate-slideIn"></div>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'OVERVIEW' && renderOverview()}
            {activeTab === 'PRODUCTION' && renderProduction()}
            {activeTab === 'FAULTS' && renderFaults()}
          </div>

          {/* Action Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
               <button className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span>Histórico Analítico</span>
               </button>
               <button className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span>Exportar Dados</span>
               </button>
            </div>
            <button className="px-10 py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-xl hover:bg-zinc-800 transition-all flex items-center space-x-3">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span>Comandar Célula</span>
            </button>
          </div>
        </div>
      </div>

      {isReportModalOpen && (
        <ReportFaultModal 
          cellName={cell.name} 
          onClose={() => setIsReportModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default CellDetail;
