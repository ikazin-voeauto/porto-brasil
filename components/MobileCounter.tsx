import React, { useState } from 'react';
import { ProductionCell } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface MobileCounterProps {
  cells: ProductionCell[];
  selectedCellId?: string;
  onCellChange?: (cellId: string) => void;
  onIncrement: (cellId: string, amount?: number) => void;
  onReportDefect: (cellId: string) => void;
  onToggleStatus: (cellId: string) => void;
  onBack: () => void;
}

const MobileCounter: React.FC<MobileCounterProps> = ({
  cells,
  selectedCellId,
  onCellChange,
  onReportDefect,
  onToggleStatus,
  onBack
}) => {
  const currentCellId = selectedCellId || cells[0]?.id || '';
  const cell = cells.find(c => c.id === currentCellId) || cells[0];

  if (!cell) return null;

  const target = cell.targetUnits || 1500;
  const remaining = Math.max(0, target - cell.unitsProduced);
  const progress = Math.min(100, (cell.unitsProduced / target) * 100);

  const handleCellSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCellId = e.target.value;
    if (onCellChange) {
      onCellChange(newCellId);
    }
  };

  return (
    <div className="fixed inset-0 bg-pb-black z-50 flex flex-col font-sans">
      {/* Header - Mobile/Tablet Optimized */}
      <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 border-b border-white/5 shrink-0 bg-pb-black">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="min-w-[48px] min-h-[48px] text-pb-gray hover:text-white hover:bg-white/5"
          aria-label="Voltar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Button>

        <div className="flex flex-col items-center flex-1 px-4">
          {/* Cell Selector */}
          <div className="relative w-full max-w-xs">
            <select
              value={currentCellId}
              onChange={handleCellSelect}
              className="w-full text-lg md:text-xl font-bold text-white bg-[#111] border border-white/10 rounded px-4 py-2 pr-8 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 appearance-none cursor-pointer text-center transition-all"
            >
              {cells.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-pb-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${cell.status === 'OPERATIONAL' ? 'bg-ind-ok text-ind-ok animate-pulse' : 'bg-ind-error text-ind-error'}`}></span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${cell.status === 'OPERATIONAL' ? 'text-ind-ok' : 'text-ind-error'}`}>
              {cell.status === 'OPERATIONAL' ? 'EM PRODUÇÃO' : 'PARADA'}
            </span>
          </div>
        </div>

        <div className="w-12 md:w-14"></div> {/* Spacer for alignment */}
      </div>

      {/* Main Content - Stack Layout for Mobile */}
      <div className="flex-1 flex flex-col p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto pb-6">
        {/* Main Counter Card - Mobile First */}
        <Card className="p-6 md:p-8 text-center border-white/5 bg-pb-darkGray relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>

          <p className="text-xs md:text-sm font-bold text-pb-gray uppercase tracking-widest mb-4 md:mb-6">PRODUÇÃO ATUAL</p>

          {/* Large Number - Responsive Size */}
          <div className="text-[5rem] md:text-[7rem] lg:text-[8rem] leading-none font-bold font-mono tracking-tighter text-white tabular-nums mb-6 md:mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {cell.unitsProduced.toLocaleString()}
          </div>

          {/* Meta and Remaining - Stack on Mobile, Side by Side on Tablet+ */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-white/5 pt-4 md:pt-6 mb-4 md:mb-6">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-pb-gray block mb-2">Meta Turno</span>
              <span className="text-lg md:text-xl font-mono font-bold text-white">{target.toLocaleString()}</span>
            </div>
            <div className="text-center border-l border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-pb-gray block mb-2">Restante</span>
              <span className="text-lg md:text-xl font-mono font-bold text-white">{remaining.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar - Touch Friendly */}
          <div className="h-4 md:h-5 w-full bg-[#111] rounded-full overflow-hidden border border-white/5 relative">
            <div
              className={`h-full transition-all duration-1000 ease-out ${progress >= 100 ? 'bg-ind-ok shadow-[0_0_10px_rgba(76,175,80,0.5)]' : 'bg-ind-ok shadow-[0_0_10px_rgba(76,175,80,0.3)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-pb-gray mt-2 font-mono">
            {Math.round(progress)}% concluído
          </p>
        </Card>

        {/* Stats Row - Stack on Mobile, Grid on Tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Quality Card */}
          <Card className="p-6 md:p-8 flex flex-col justify-center items-center min-h-[140px] md:min-h-[160px] border-white/5 bg-pb-darkGray">
            <div className="text-center mb-4">
              <span className="text-4xl md:text-5xl font-bold font-mono text-white tracking-tight block mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {cell.quality}%
              </span>
              <span className="text-[10px] font-bold uppercase text-pb-gray tracking-widest">Qualidade</span>
            </div>
            {/* Simplified Quality Indicator */}
            <div className="flex items-center space-x-2 w-full justify-center">
              <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-ind-ok shadow-[0_0_5px_rgba(76,175,80,0.5)]" style={{ width: `${cell.quality}%` }}></div>
              </div>
            </div>
          </Card>

          {/* Rejects Card */}
          <Card className="p-6 md:p-8 flex flex-col justify-center items-center min-h-[140px] md:min-h-[160px] border-white/5 bg-pb-darkGray">
            <span className="text-4xl md:text-5xl font-bold font-mono text-ind-error tracking-tight block mb-2 drop-shadow-[0_0_10px_rgba(244,67,54,0.3)]">
              {cell.badPieces.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold uppercase text-pb-gray tracking-widest text-center">Peças<br />Refugadas</span>
          </Card>
        </div>

        {/* Secondary Actions - Stack on Mobile, Grid on Tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pb-4">
          <Button
            onClick={() => onReportDefect(cell.id)}
            variant="danger"
            size="lg"
            className="w-full min-h-[56px] md:min-h-[64px] py-4 flex flex-col items-center justify-center gap-2 touch-target"
            aria-label="Reportar Defeito"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-xs md:text-sm">REPORTAR DEFEITO</span>
          </Button>

          <Button
            onClick={() => onToggleStatus(cell.id)}
            variant="secondary"
            size="lg"
            className={`w-full min-h-[56px] md:min-h-[64px] py-4 flex flex-col items-center justify-center gap-2 touch-target border ${cell.status === 'OPERATIONAL'
                ? 'bg-ind-warn/10 border-ind-warn/50 text-ind-warn hover:bg-ind-warn hover:text-pb-black shadow-[0_0_10px_rgba(255,193,7,0.1)]'
                : 'bg-ind-ok/10 border-ind-ok/50 text-ind-ok hover:bg-ind-ok hover:text-pb-white shadow-[0_0_10px_rgba(76,175,80,0.1)]'
              }`}
            aria-label={cell.status === 'OPERATIONAL' ? 'Pausar Célula' : 'Retomar Célula'}
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-xs md:text-sm">{cell.status === 'OPERATIONAL' ? 'PAUSAR CÉLULA' : 'RETOMAR'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileCounter;
