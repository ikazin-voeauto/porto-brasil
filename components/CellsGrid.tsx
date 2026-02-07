import React, { useMemo, useState } from 'react';
import { ProductionCell } from '../types';
import Card from './ui/Card';
import StatusBadge, { Status } from './ui/StatusBadge';

interface CellsGridProps {
  cells: ProductionCell[];
  onCellClick: (cell: ProductionCell) => void;
}

const CellsGrid: React.FC<CellsGridProps> = ({ cells, onCellClick }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredCells = useMemo(() => {
    if (filter === 'ALL') return cells;
    return cells.filter(c => c.status === filter);
  }, [cells, filter]);

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Filters */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 shrink-0">
        {['ALL', 'OPERATIONAL', 'WARNING', 'STOPPED', 'MAINTENANCE'].map(status => {
          const labels: Record<string, string> = {
            ALL: 'TODOS',
            OPERATIONAL: 'OPERANDO',
            WARNING: 'ALERTA',
            STOPPED: 'PARADO',
            MAINTENANCE: 'MANUTENÇÃO'
          };
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all border ${filter === status
                ? 'bg-white text-pb-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'bg-transparent border-white/10 text-pb-gray hover:border-white/30 hover:text-white'
                }`}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 overflow-y-auto pb-20 p-1">
        {filteredCells.map((cell) => {
          // Status Color Logic
          const statusColor =
            cell.status === 'OPERATIONAL' ? 'border-l-ind-ok shadow-[inset_2px_0_0_0_rgba(76,175,80,0.2)]' :
              cell.status === 'STOPPED' ? 'border-l-ind-error shadow-[inset_2px_0_0_0_rgba(244,67,54,0.2)]' :
                cell.status === 'WARNING' ? 'border-l-ind-warn shadow-[inset_2px_0_0_0_rgba(255,193,7,0.2)]' :
                  'border-l-ind-info shadow-[inset_2px_0_0_0_rgba(33,150,243,0.2)]';

          return (
            <Card
              key={cell.id}
              className={`
                cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 
                group relative overflow-hidden flex flex-col justify-between min-h-[260px]
                border-l-[6px] ${statusColor} bg-pb-darkGray border-y border-r border-white/5
              `}
              onClick={() => onCellClick(cell)}
              noPadding
            >
              <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-pb-gray tracking-widest uppercase mb-1 block">Célula</span>
                    <span className="text-2xl font-bold text-white tracking-tight leading-none group-hover:text-white/90 transition-colors">{cell.name}</span>
                  </div>
                  <div className="transform scale-110 origin-top-right">
                    <StatusBadge status={cell.status as Status} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/20 p-3 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[10px] font-bold text-pb-gray uppercase tracking-wider mb-1">OEE</p>
                    <div className="flex items-baseline">
                      <p className={`text-2xl font-bold font-mono tracking-tighter ${cell.oee < 80 ? 'text-ind-error drop-shadow-[0_0_5px_rgba(244,67,54,0.5)]' : 'text-white'}`}>
                        {cell.oee}
                      </p>
                      <span className="text-xs font-bold text-pb-gray ml-0.5">%</span>
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[10px] font-bold text-pb-gray uppercase tracking-wider mb-1">Temp.</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold font-mono tracking-tighter text-white">
                        {cell.temperature.toFixed(0)}
                      </p>
                      <span className="text-xs font-bold text-pb-gray ml-0.5">°C</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    <span className="font-mono text-pb-gray text-xs">
                      Prod: <span className="text-white font-bold ml-1">{cell.unitsProduced.toLocaleString()}</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
                    Ver Detalhes &rarr;
                  </span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {cell.status === 'STOPPED' && (
                <div className="absolute inset-0 bg-ind-error/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CellsGrid;
