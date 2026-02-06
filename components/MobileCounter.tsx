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
  onIncrement,
  onReportDefect,
  onToggleStatus,
  onBack
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [incrementAmount, setIncrementAmount] = useState(1);
  
  const currentCellId = selectedCellId || cells[0]?.id || '';
  const cell = cells.find(c => c.id === currentCellId) || cells[0];
  
  if (!cell) return null;

  const target = cell.targetUnits || 1500;
  const remaining = Math.max(0, target - cell.unitsProduced);
  const progress = Math.min(100, (cell.unitsProduced / target) * 100);

  const handleIncrement = (amount: number = incrementAmount) => {
    if (navigator.vibrate) navigator.vibrate(50);
    onIncrement(cell.id, amount);
    setShowActionsMenu(false);
  };

  const handleCellSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCellId = e.target.value;
    if (onCellChange) {
      onCellChange(newCellId);
    }
  };

  return (
    <div className="fixed inset-0 bg-pb-offWhite z-50 flex flex-col font-sans">
      {/* Header - Mobile/Tablet Optimized */}
      <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 border-b border-pb-lightGray shrink-0 bg-pb-white">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="min-w-[48px] min-h-[48px]"
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
              className="w-full text-lg md:text-xl font-bold text-pb-black bg-pb-offWhite border border-pb-lightGray rounded-md px-4 py-2 pr-8 focus:outline-none focus:border-pb-black appearance-none cursor-pointer text-center"
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
            <span className={`w-2 h-2 rounded-full ${cell.status === 'OPERATIONAL' ? 'bg-ind-ok animate-pulse' : 'bg-ind-error'}`}></span>
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
        <Card className="p-6 md:p-8 text-center">
          <p className="text-xs md:text-sm font-bold text-pb-gray uppercase tracking-widest mb-4 md:mb-6">PRODUÇÃO ATUAL</p>

          {/* Large Number - Responsive Size */}
          <div className="text-[5rem] md:text-[7rem] lg:text-[8rem] leading-none font-bold font-mono tracking-tighter text-pb-black tabular-nums mb-6 md:mb-8">
            {cell.unitsProduced.toLocaleString()}
          </div>

          {/* Meta and Remaining - Stack on Mobile, Side by Side on Tablet+ */}
          <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-pb-lightGray pt-4 md:pt-6 mb-4 md:mb-6">
            <div className="text-center">
              <span className="text-[10px] uppercase tracking-widest text-pb-gray block mb-2">Meta Turno</span>
              <span className="text-lg md:text-xl font-mono font-bold text-pb-black">{target.toLocaleString()}</span>
            </div>
            <div className="text-center border-l border-pb-lightGray">
              <span className="text-[10px] uppercase tracking-widest text-pb-gray block mb-2">Restante</span>
              <span className="text-lg md:text-xl font-mono font-bold text-pb-black">{remaining.toLocaleString()}</span>
            </div>
          </div>

          {/* Progress Bar - Touch Friendly */}
          <div className="h-4 md:h-5 w-full bg-pb-offWhite rounded-full overflow-hidden border border-pb-lightGray">
            <div
              className={`h-full transition-all duration-500 ease-out ${progress >= 100 ? 'bg-ind-ok' : 'bg-ind-ok'}`}
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
          <Card className="p-6 md:p-8 flex flex-col justify-center items-center min-h-[140px] md:min-h-[160px]">
            <div className="text-center mb-4">
              <span className="text-4xl md:text-5xl font-bold font-mono text-pb-black tracking-tight block mb-2">
                {cell.quality}%
              </span>
              <span className="text-[10px] font-bold uppercase text-pb-gray tracking-widest">Qualidade</span>
            </div>
            {/* Simplified Quality Indicator */}
            <div className="flex items-center space-x-2 w-full justify-center">
              <div className="flex-1 h-2 bg-pb-offWhite rounded-full overflow-hidden border border-pb-lightGray">
                <div className="h-full bg-ind-ok" style={{ width: `${cell.quality}%` }}></div>
              </div>
            </div>
          </Card>

          {/* Rejects Card */}
          <Card className="p-6 md:p-8 flex flex-col justify-center items-center min-h-[140px] md:min-h-[160px]">
            <span className="text-4xl md:text-5xl font-bold font-mono text-ind-error tracking-tight block mb-2">
              {cell.badPieces.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold uppercase text-pb-gray tracking-widest text-center">Peças<br />Refugadas</span>
          </Card>
        </div>

        {/* Main Action Button with Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="w-full min-h-[64px] md:min-h-[72px] py-4 md:py-5 bg-ind-ok text-pb-white rounded-lg active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-2 touch-target hover:opacity-90"
            aria-label="Registrar Produção"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span className="text-base md:text-lg font-bold uppercase tracking-widest">REGISTRAR PRODUÇÃO</span>
          </button>

          {/* Actions Menu Dropdown */}
          {showActionsMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowActionsMenu(false)}
              ></div>
              <Card className="absolute bottom-full left-0 right-0 mb-2 z-50 p-4 shadow-lg">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-3">Quantidade</p>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 5, 10, 25].map(amount => (
                      <button
                        key={amount}
                        onClick={() => {
                          setIncrementAmount(amount);
                          handleIncrement(amount);
                        }}
                        className={`py-3 px-4 rounded-md font-bold text-sm transition-all ${
                          incrementAmount === amount
                            ? 'bg-pb-black text-pb-white'
                            : 'bg-pb-offWhite border border-pb-lightGray text-pb-black hover:bg-pb-lightGray'
                        }`}
                      >
                        +{amount}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={incrementAmount}
                      onChange={(e) => setIncrementAmount(parseInt(e.target.value) || 1)}
                      className="flex-1 px-3 py-2 border border-pb-lightGray rounded-md text-sm font-mono focus:outline-none focus:border-pb-black"
                      placeholder="Custom"
                    />
                    <Button
                      onClick={() => handleIncrement(incrementAmount)}
                      variant="primary"
                      size="md"
                      className="px-6"
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* Secondary Actions - Stack on Mobile, Grid on Tablet+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pb-4">
          <Button
            onClick={() => onReportDefect(cell.id)}
            variant="secondary"
            size="lg"
            className="w-full min-h-[56px] md:min-h-[64px] py-4 bg-ind-error/10 border-2 border-ind-error/30 text-ind-error hover:bg-ind-error hover:text-pb-white flex flex-col items-center justify-center gap-2 touch-target"
            aria-label="Reportar Defeito"
          >
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-xs md:text-sm">REPORTAR DEFEITO</span>
          </Button>

          <Button
            onClick={() => onToggleStatus(cell.id)}
            variant="secondary"
            size="lg"
            className={`w-full min-h-[56px] md:min-h-[64px] py-4 flex flex-col items-center justify-center gap-2 touch-target border-2 ${
              cell.status === 'OPERATIONAL'
                ? 'bg-ind-warn/10 border-ind-warn/30 text-ind-warn hover:bg-ind-warn hover:text-pb-black'
                : 'bg-ind-ok/10 border-ind-ok/30 text-ind-ok hover:bg-ind-ok hover:text-pb-white'
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
