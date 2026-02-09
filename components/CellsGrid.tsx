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
    <div className="p-3 xs:p-4 sm:p-6 h-full flex flex-col">
      {/* Filters - Scroll on mobile, compact */}
      <div className="flex gap-1.5 xs:gap-2 mb-3 xs:mb-6 overflow-x-auto pb-2 shrink-0 scrollbar-thin">
        {['ALL', 'OPERATIONAL', 'WARNING', 'STOPPED', 'MAINTENANCE'].map(status => {
          const labels: Record<string, string> = {
            ALL: 'TODOS',
            OPERATIONAL: 'OK',
            WARNING: 'ALERTA',
            STOPPED: 'PARADO',
            MAINTENANCE: 'MANUT.'
          };
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-2.5 xs:px-4 py-1.5 xs:py-2 rounded text-[10px] xs:text-xs font-bold uppercase tracking-widest transition-all border flex-shrink-0 ${filter === status
                ? 'bg-pb-white text-pb-black border-pb-white'
                : 'bg-transparent border-white/10 text-pb-gray hover:border-white/30 hover:text-pb-white'
                }`}
            >
              {labels[status]}
            </button>
          );
        })}
      </div>

      {/* Grid - Larger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4 sm:gap-6 overflow-y-auto pb-24">
        {filteredCells.map((cell) => {
          const statusColor =
            cell.status === 'OPERATIONAL' ? 'border-l-ind-ok' :
              cell.status === 'STOPPED' ? 'border-l-ind-error' :
                cell.status === 'WARNING' ? 'border-l-ind-warn' :
                  'border-l-ind-info';

          return (
            <Card
              key={cell.id}
              className={`cursor-pointer hover:border-white/20 active:scale-[0.99] transition-all duration-200 group relative overflow-hidden flex flex-col justify-between min-h-[280px] sm:min-h-[320px] border-l-8 ${statusColor} bg-pb-darkGray border border-white/5 shadow-xl`}
              onClick={() => onCellClick(cell)}
              noPadding
            >
              <div className="p-5 sm:p-7 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-pb-gray tracking-widest uppercase mb-1 block">Célula</span>
                    <span className="text-3xl sm:text-4xl font-bold text-pb-white tracking-tight leading-none truncate block">{cell.name}</span>
                  </div>
                  <div className="flex-shrink-0 scale-125 origin-top-right"><StatusBadge status={cell.status as Status} size="sm" /></div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-pb-black/30 p-4 rounded-lg border border-white/5">
                    <p className="text-xs font-bold text-pb-gray uppercase tracking-wider mb-1">OEE</p>
                    <div className="flex items-baseline">
                      <p className={`text-4xl sm:text-5xl font-bold font-mono tracking-tighter ${cell.oee < 80 ? 'text-ind-error' : 'text-pb-white'}`}>
                        {cell.oee}
                      </p>
                      <span className="text-sm font-bold text-pb-gray ml-1">%</span>
                    </div>
                  </div>
                  <div className="bg-pb-black/30 p-4 rounded-lg border border-white/5">
                    <p className="text-xs font-bold text-pb-gray uppercase tracking-wider mb-1">Temp.</p>
                    <div className="flex items-baseline">
                      <p className="text-4xl sm:text-5xl font-bold font-mono tracking-tighter text-pb-white">
                        {cell.temperature.toFixed(0)}
                      </p>
                      <span className="text-sm font-bold text-pb-gray ml-1">°C</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-white/5 flex justify-between items-center gap-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-pb-white/20 flex-shrink-0"></span>
                    <span className="font-mono text-pb-gray text-sm sm:text-base truncate">
                      Prod: <span className="text-pb-white font-bold ml-1 text-lg">{cell.unitsProduced.toLocaleString()}</span>
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-pb-white/80 group-hover:text-pb-white transition-colors uppercase tracking-widest flex-shrink-0">
                    Ver Detalhes &rarr;
                  </span>
                </div>
              </div>

              {cell.status === 'STOPPED' && (
                <div className="absolute inset-0 bg-ind-error/10 pointer-events-none" />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CellsGrid;
