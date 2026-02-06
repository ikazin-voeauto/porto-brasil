import React, { useState } from 'react';
import { ProductionCell } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Button from './ui/Button';

interface MobileCounterProps {
  cell: ProductionCell;
  onIncrement: () => void;
  onReportDefect: () => void;
  onToggleStatus: () => void;
  onBack: () => void;
}

const MobileCounter: React.FC<MobileCounterProps> = ({
  cell,
  onIncrement,
  onReportDefect,
  onToggleStatus,
  onBack
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Industrial Palette for Charts
  const pieData = [
    { name: 'Boas', value: cell.goodPieces, color: '#F5F6F2' }, // offWhite
    { name: 'Defeituosas', value: cell.badPieces, color: '#8E2A2A' } // ind.error
  ];

  const handleIncrement = () => {
    // Add haptic feedback if implemented in native wrapper
    if (navigator.vibrate) navigator.vibrate(50);
    onIncrement();
  };

  return (
    <div className="fixed inset-0 bg-pb-black text-pb-white z-50 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-pb-darkGray shrink-0">
        <button onClick={onBack} className="text-pb-gray p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold tracking-widest uppercase">{cell.name}</h2>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${cell.status === 'OPERATIONAL' ? 'bg-ind-ok text-pb-white' : 'bg-ind-error text-pb-white'}`}>
            {cell.status === 'OPERATIONAL' ? 'PRODUZINDO' : 'PARADA'}
          </span>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
        {/* Main Counter Card */}
        <div className="bg-pb-darkGray rounded-xl p-6 text-center shadow-lg border border-pb-gray/20">
          <p className="text-xs font-bold text-pb-gray uppercase tracking-widest mb-2">Produção Total</p>
          <div className="text-[5rem] leading-none font-bold font-mono tracking-tighter text-pb-white">
            {cell.productionCount}
          </div>
          <div className="mt-4 flex justify-between px-8 text-xs font-mono text-pb-gray">
            <span>Meta: {cell.target}</span>
            <span>Restante: {cell.target - cell.productionCount}</span>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-pb-black rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-ind-ok" style={{ width: `${(cell.productionCount / cell.target) * 100}%` }}></div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 h-32">
          <div className="bg-pb-darkGray rounded-xl p-4 flex flex-col justify-center items-center border border-pb-gray/20 relative">
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="relative z-10 text-center">
              <p className="text-2xl font-bold font-mono">{cell.quality}%</p>
              <p className="text-[10px] uppercase text-pb-gray">Qualidade</p>
            </div>
          </div>

          <div className="bg-pb-darkGray rounded-xl p-4 flex flex-col justify-center items-center border border-pb-gray/20">
            <p className="text-3xl font-bold font-mono text-ind-error">{cell.badPieces}</p>
            <p className="text-[10px] uppercase text-pb-gray text-center mt-1">Refugos<br />Acumulados</p>
          </div>
        </div>

        {/* Main Action Button (Huge) */}
        <button
          onClick={handleIncrement}
          className="w-full py-8 bg-ind-ok text-pb-white rounded-xl shadow-lg active:scale-[0.98] transition-all group relative overflow-hidden"
        >
          <span className="relative z-10 text-xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span>Registrar Produção</span>
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity"></div>
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onReportDefect}
            className="w-full py-6 bg-ind-error text-pb-white rounded-xl shadow-lg active:scale-[0.98] transition-all flex flex-col items-center justify-center font-bold uppercase tracking-widest text-xs"
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Reportar Defeito
          </button>

          <button
            onClick={onToggleStatus}
            className={`w-full py-6 rounded-xl shadow-lg active:scale-[0.98] transition-all flex flex-col items-center justify-center font-bold uppercase tracking-widest text-xs ${cell.status === 'OPERATIONAL' ? 'bg-ind-warn text-pb-white' : 'bg-ind-ok text-pb-white'
              }`}
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {cell.status === 'OPERATIONAL' ? 'Pausar Célula' : 'Retomar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCounter;
