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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 overflow-y-auto pb-20">
        {filteredCells.map(cell => (
          <Card
            key={cell.id}
            className={`cursor-pointer hover:border-pb-black transition-all group relative overflow-hidden flex flex-col justify-between`}
            onClick={() => onCellClick(cell)}
            noPadding
          >
            {/* Status Indicator Strip */}
            <div className={`h-1.5 w-full ${cell.status === 'OPERATIONAL' ? 'bg-ind-ok' :
                cell.status === 'STOPPED' ? 'bg-ind-error' :
                  cell.status === 'WARNING' ? 'bg-ind-warn' : 'bg-blue-500'
              }`}></div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xl font-bold text-pb-black tracking-tight">{cell.name}</span>
                <StatusBadge status={cell.status as Status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] text-pb-gray uppercase tracking-widest mb-0.5">OEE</p>
                  <p className={`text-2xl font-bold font-mono ${cell.oee < 80 ? 'text-ind-error' : 'text-pb-black'}`}>
                    {cell.oee}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-pb-gray uppercase tracking-widest mb-0.5">Temp.</p>
                  <p className="text-2xl font-bold font-mono text-pb-black">
                    {cell.temperature.toFixed(0)}°
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-pb-lightGray/50 flex justify-between items-center">
                <span className="text-xs font-mono text-pb-gray">
                  Prod: <span className="text-pb-black font-bold">{cell.productionCount}</span>
                </span>
                <span className="text-[10px] font-bold text-pb-gray uppercase tracking-widest group-hover:text-pb-black transition-colors">
                  Detalhes &rarr;
                </span>
              </div>
            </div>

            {cell.status === 'STOPPED' && (
              <div className="absolute inset-0 bg-ind-error/5 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CellsGrid;
