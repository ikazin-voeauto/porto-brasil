
import React, { useState } from 'react';
import { ProductionCell } from '../types';

interface CellsGridProps {
  cells: ProductionCell[];
  onCellClick: (cell: ProductionCell) => void;
}

const CellsGrid: React.FC<CellsGridProps> = ({ cells, onCellClick }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredCells = filter === 'ALL' 
    ? cells 
    : cells.filter(c => c.status === filter);

  const statusColors: Record<string, string> = {
    OPERATIONAL: 'bg-green-500',
    WARNING: 'bg-yellow-500',
    STOPPED: 'bg-red-500',
    MAINTENANCE: 'bg-blue-500',
  };

  const statusLabels: Record<string, string> = {
    OPERATIONAL: 'Operacional',
    WARNING: 'Atenção',
    STOPPED: 'Parada',
    MAINTENANCE: 'Manutenção',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex space-x-2">
          {['ALL', 'OPERATIONAL', 'WARNING', 'STOPPED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                filter === f ? 'bg-black text-[#D4AF37]' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {f === 'ALL' ? 'Todos' : statusLabels[f]}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-400">
          Exibindo <span className="text-black font-bold">{filteredCells.length}</span> de <span className="text-black font-bold">{cells.length}</span> células
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCells.map(cell => (
          <div 
            key={cell.id}
            onClick={() => onCellClick(cell)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden"
          >
            <div className={`h-1.5 w-full ${statusColors[cell.status]}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-luxury text-lg text-black leading-none">{cell.name}</h4>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cell.id}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${statusColors[cell.status]} ${cell.status === 'STOPPED' ? 'animate-pulse' : ''}`}></div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Eficiência OEE</span>
                  <span className={`text-xl font-luxury ${cell.oee < 80 ? 'text-red-500' : 'text-gold'}`}>{cell.oee}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${cell.oee < 80 ? 'bg-red-500' : 'bg-gold'}`}
                    style={{ width: `${cell.oee}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400 uppercase font-medium">Produto Atual</span>
                  <span className="text-black font-bold uppercase">{cell.currentProduct}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400 uppercase font-medium">Prod. Real/Meta</span>
                  <span className="text-black font-bold">{cell.unitsProduced} / {cell.targetUnits}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400 uppercase font-medium">Temperatura</span>
                  <span className="text-black font-bold">{cell.temperature.toFixed(1)} °C</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Ver Detalhes</span>
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CellsGrid;
