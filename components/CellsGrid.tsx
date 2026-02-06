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
        {['ALL', 'OPERATIONAL', 'WARNING', 'STOPPED', 'MAINTENANCE'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${filter === status
              ? 'bg-pb-black text-pb-white shadow-md'
              : 'bg-pb-white border border-pb-lightGray text-pb-gray hover:bg-pb-offWhite hover:text-pb-black'
              }`}
          >
            {status === 'ALL' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 overflow-y-auto pb-20 p-1">
        {filteredCells.map((cell) => {
          // Status Color Logic
          const statusColor =
            cell.status === 'OPERATIONAL' ? 'border-l-ind-ok' :
              cell.status === 'STOPPED' ? 'border-l-ind-error' :
                cell.status === 'WARNING' ? 'border-l-ind-warn' :
                  'border-l-ind-info';

          return (
            <Card
              key={cell.id}
              className={`
                cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 
                group relative overflow-hidden flex flex-col justify-between min-h-[260px]
                border-l-[6px] ${statusColor}
              `}
              onClick={() => onCellClick(cell)}
              noPadding
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-pb-gray tracking-widest uppercase mb-1 block">Célula</span>
                    <span className="text-2xl font-bold text-pb-black tracking-tight leading-none">{cell.name}</span>
                  </div>
                  <div className="transform scale-110 origin-top-right">
                    <StatusBadge status={cell.status as Status} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-pb-offWhite/30 p-2 rounded-lg border border-transparent hover:border-pb-lightGray/50 transition-colors">
                    <p className="text-xs font-semibold text-pb-gray uppercase tracking-wider mb-1">OEE</p>
                    <div className="flex items-baseline">
                      <p className={`text-3xl font-bold font-mono tracking-tighter ${cell.oee < 80 ? 'text-ind-error' : 'text-pb-black'}`}>
                        {cell.oee}
                      </p>
                      <span className="text-sm font-semibold text-pb-gray ml-0.5">%</span>
                    </div>
                  </div>
                  <div className="bg-pb-offWhite/30 p-2 rounded-lg border border-transparent hover:border-pb-lightGray/50 transition-colors">
                    <p className="text-xs font-semibold text-pb-gray uppercase tracking-wider mb-1">Temp.</p>
                    <div className="flex items-baseline">
                      <p className="text-3xl font-bold font-mono tracking-tighter text-pb-black">
                        {cell.temperature.toFixed(0)}
                      </p>
                      <span className="text-sm font-semibold text-pb-gray ml-0.5">°C</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-pb-lightGray/30 flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-pb-black/20"></span>
                    <span className="font-mono text-pb-gray">
                      Prod: <span className="text-pb-black font-bold text-base ml-1">{cell.unitsProduced.toLocaleString()}</span>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-pb-black opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    Ver Detalhes &rarr;
                  </span>
                </div>
              </div>

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
