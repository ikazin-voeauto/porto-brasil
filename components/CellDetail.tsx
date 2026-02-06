import React, { useState } from 'react';
import { ProductionCell } from '../types';
import ReportFaultModal from './ReportFaultModal';
import Card from './ui/Card';
import Button from './ui/Button';

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
          <Card key={i} className={`flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform ${m.highlight ? 'border-ind-ok/50' : ''}`}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-pb-gray">{m.label}</span>
            <span className={`text-3xl font-mono ${m.highlight ? 'text-pb-black' : 'text-pb-black'}`}>{m.value}</span>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-[10px] font-bold uppercase text-pb-gray tracking-widest mb-6 flex items-center">
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
              <span className="text-xs text-pb-gray font-medium group-hover:text-pb-black transition-colors">{s.name}</span>
              <div className="text-right">
                <p className={`font-mono text-sm ${s.ok ? 'text-pb-black' : 'text-ind-error'}`}>{s.val}</p>
                <div className={`h-1 w-8 rounded-full ml-auto mt-1 ${s.ok ? 'bg-ind-ok' : 'bg-ind-error animate-pulse'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="pt-8 border-t border-pb-lightGray">
        <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest mb-4">Informações Técnicas</p>
        <div className="text-xs space-y-2">
          <div className="flex justify-between"><span className="text-pb-gray">Localização:</span><span className="font-medium text-pb-black">Pavilhão C - Ala 2</span></div>
          <div className="flex justify-between"><span className="text-pb-gray">Firmware:</span><span className="font-mono text-pb-black">v4.2.1-ind</span></div>
          <div className="flex justify-between"><span className="text-pb-gray">Última Ref.:</span><span className="font-mono text-pb-black">12:04:22</span></div>
        </div>
      </div>

      <Button
        onClick={() => setIsReportModalOpen(true)}
        className="w-full mt-4"
        variant="secondary"
      >
        Reportar Falha
      </Button>
    </div>
  );

  const renderProduction = () => (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-pb-black">{cell.currentProduct}</h3>
            <p className="text-[10px] text-pb-gray uppercase tracking-widest">Ordem Ativa</p>
          </div>
          <span className="px-3 py-1 bg-ind-ok/10 text-ind-ok text-[10px] font-bold uppercase rounded-full">Em Produção</span>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-bold text-pb-black">
            <span>Progresso</span>
            <span>{Math.round((cell.unitsProduced / cell.targetUnits) * 100)}%</span>
          </div>
          <div className="w-full h-4 bg-pb-offWhite rounded-full overflow-hidden">
            <div
              className="h-full bg-pb-black transition-all duration-1000"
              style={{ width: `${(cell.unitsProduced / cell.targetUnits) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-pb-gray">
            <span>{cell.unitsProduced} produzidos</span>
            <span>Meta: {cell.targetUnits}</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFaults = () => (
    <div className="space-y-4 animate-fadeIn">
      {cell.lastFault ? (
        <Card className="border-l-4 border-l-ind-error">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-ind-error/10 text-ind-error rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="font-bold text-pb-black text-sm">Falha Ativa Detectada</p>
              <p className="text-xs text-pb-gray mt-1 mb-2">{cell.lastFault}</p>
              <span className="text-[10px] font-mono bg-pb-offWhite px-2 py-1 rounded text-pb-gray">ERR-001</span>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-pb-gray">Nenhuma falha registrada recentemente.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-pb-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}></div>

      <div className="w-full md:w-[600px] h-full bg-pb-offWhite relative z-10 flex flex-col animate-slideLeft border-l border-pb-lightGray">
        {/* Header */}
        <div className="bg-pb-white p-8 border-b border-pb-lightGray flex justify-between items-center shrink-0">
          <div>
            <span className="text-[10px] font-bold text-pb-gray uppercase tracking-widest block mb-1">Detalhes da Célula</span>
            <h2 className="text-3xl font-bold text-pb-black tracking-tighter">{cell.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pb-offWhite rounded-full transition-colors text-pb-gray hover:text-pb-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-pb-lightGray bg-pb-white px-8">
          {[
            { id: 'OVERVIEW', label: 'Visão Geral' },
            { id: 'PRODUCTION', label: 'Produção' },
            { id: 'FAULTS', label: 'Histórico' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 mr-8 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-pb-black' : 'text-pb-gray hover:text-pb-black'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pb-black"></div>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'OVERVIEW' && renderOverview()}
          {activeTab === 'PRODUCTION' && renderProduction()}
          {activeTab === 'FAULTS' && renderFaults()}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-pb-lightGray bg-pb-white shrink-0">
          <div className="flex gap-4">
            <Button className="flex-1" variant="secondary">Histórico Completo</Button>
            <Button className="flex-1" variant="primary">Comandar Célula</Button>
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
