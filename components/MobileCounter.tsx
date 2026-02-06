
import React, { useState, useEffect } from 'react';
import { ProductionCell } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import ReportFaultModal from './ReportFaultModal';

interface MobileCounterProps {
  cell: ProductionCell;
}

const MobileCounter: React.FC<MobileCounterProps> = ({ cell: initialCell }) => {
  const [cell, setCell] = useState<ProductionCell>(initialCell);
  const [isPaused, setIsPaused] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [lastIncrement, setLastIncrement] = useState<number | null>(null);

  const pieData = [
    { name: 'Boas', value: cell.goodPieces, color: '#D4AF37' },
    { name: 'Defeituosas', value: cell.badPieces, color: '#000000' }
  ];

  const handleIncrement = () => {
    if (isPaused) return;
    setCell(prev => ({
      ...prev,
      unitsProduced: prev.unitsProduced + 1,
      goodPieces: prev.goodPieces + 1,
      quality: parseFloat(((prev.goodPieces + 1) / (prev.unitsProduced + 1) * 100).toFixed(1))
    }));
    setLastIncrement(Date.now());
  };

  const handleDefect = () => {
    if (isPaused) return;
    setCell(prev => ({
      ...prev,
      unitsProduced: prev.unitsProduced + 1,
      badPieces: prev.badPieces + 1,
      quality: parseFloat((prev.goodPieces / (prev.unitsProduced + 1) * 100).toFixed(1))
    }));
    setIsReportOpen(true);
  };

  const progress = (cell.unitsProduced / cell.targetUnits) * 100;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-[#F5F5DC] animate-fadeIn pb-16">
      {/* Top Bar - Identity */}
      <div className="p-6 bg-black text-white flex justify-between items-center shrink-0 shadow-lg">
        <div>
          <h2 className="font-luxury text-2xl tracking-widest text-gold uppercase">{cell.id}</h2>
          <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{cell.currentProduct}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">{isPaused ? 'Pausado' : 'Produzindo'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Main Counter Display */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      const { cx, cy } = viewBox as any;
                      return (
                        <g>
                          <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                            Produzidas
                          </text>
                          <text x={cx} y={cy + 25} textAnchor="middle" dominantBaseline="middle" className="fill-black font-luxury text-6xl">
                            {cell.unitsProduced}
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              <span>Progresso Meta</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden border border-zinc-100">
              <div 
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Meta de Turno: {cell.targetUnits}</p>
          </div>
        </div>

        {/* Real-Time Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Qualidade OEE</span>
            <span className="text-3xl font-luxury text-gold">{cell.quality}%</span>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Refugo</span>
            <span className="text-3xl font-luxury text-red-500">{cell.badPieces}</span>
          </div>
        </div>
      </div>

      {/* Control Panel - Bottom Dock */}
      <div className="p-6 bg-white border-t border-zinc-100 shadow-2xl flex flex-col gap-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex-1 py-5 rounded-2xl flex flex-col items-center justify-center transition-all ${
              isPaused ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-zinc-100 text-black border border-zinc-200'
            }`}
          >
            {isPaused ? (
              <>
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-widest">Retomar</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-widest">Pausar</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handleDefect}
            disabled={isPaused}
            className="flex-1 py-5 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center justify-center border border-red-100 disabled:opacity-30 active:scale-95 transition-transform"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Defeito</span>
          </button>
        </div>

        <button 
          onClick={handleIncrement}
          disabled={isPaused}
          className="w-full py-10 bg-black text-[#D4AF37] rounded-3xl flex flex-col items-center justify-center shadow-2xl disabled:opacity-30 active:scale-[0.98] transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gold/5 group-active:bg-gold/10 transition-colors"></div>
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span className="text-sm font-bold uppercase tracking-[0.3em]">Incrementar Peça</span>
        </button>
      </div>

      {isReportOpen && (
        <ReportFaultModal 
          cellName={cell.name} 
          onClose={() => setIsReportOpen(false)} 
        />
      )}
    </div>
  );
};

export default MobileCounter;
