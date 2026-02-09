
import React, { useState, useMemo } from 'react';
import { ProductionCell } from '../types';
import { MOCK_HISTORY } from '../data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from './ui/Card';
import Button from './ui/Button';
import StatusBadge from './ui/StatusBadge';

interface DashboardProps {
  cells: ProductionCell[];
  onCellClick: (cell: ProductionCell) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ cells, onCellClick }) => {
  const [filterCell, setFilterCell] = useState<string>('ALL');
  const [showRawValues, setShowRawValues] = useState(false);

  const displayCells = useMemo(() => {
    return filterCell === 'ALL' ? cells : cells.filter(c => c.id === filterCell);
  }, [cells, filterCell]);

  const stats = useMemo(() => {
    const count = displayCells.length;
    return {
      avgOee: displayCells.reduce((acc, c) => acc + c.oee, 0) / count,
      avgAvail: displayCells.reduce((acc, c) => acc + c.availability, 0) / count,
      avgPerf: displayCells.reduce((acc, c) => acc + c.performance, 0) / count,
      avgQual: displayCells.reduce((acc, c) => acc + c.quality, 0) / count,
      totalGood: displayCells.reduce((acc, c) => acc + c.goodPieces, 0),
      totalBad: displayCells.reduce((acc, c) => acc + c.badPieces, 0),
    };
  }, [displayCells]);

  const kpis = [
    { label: 'OEE Global', value: stats.avgOee.toFixed(1) + '%', sub: 'Eficiência Total', color: 'text-white' },
    { label: 'Disponibilidade', value: stats.avgAvail.toFixed(1) + '%', sub: 'Tempo Ativo', color: 'text-[#E0E0E0]' },
    { label: 'Performance', value: stats.avgPerf.toFixed(1) + '%', sub: 'Velocidade', color: 'text-[#E0E0E0]' },
    { label: 'Qualidade', value: stats.avgQual.toFixed(1) + '%', sub: 'Peças Conformadas', color: 'text-ind-ok' },
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-6 pb-24 xs:pb-24 sm:pb-20">
      {/* Header Controls - Compact on <440px */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-3 xs:gap-4 bg-pb-darkGray/50 backdrop-blur-sm border-white/5">
        <div className="flex items-end gap-2 xs:gap-4 flex-wrap">
          <div className="flex flex-col flex-1 min-w-0 max-[439px]:min-w-[140px] xs:w-48 sm:w-64">
            <label className="text-[9px] xs:text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-1">Unidade</label>
            <select
              value={filterCell}
              onChange={(e) => setFilterCell(e.target.value)}
              className="bg-[#111] border border-white/10 rounded px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm font-semibold text-pb-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all appearance-none w-full"
            >
              <option value="ALL">Todas (01-20)</option>
              {cells.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        
        </div>

        <div className="flex items-center gap-4 xs:gap-6 sm:gap-8 flex-shrink-0 min-w-0">
          <div className="text-right min-w-0">
            <p className="text-[9px] xs:text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-0.5">Boas</p>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-ind-ok tracking-tight truncate">{stats.totalGood.toLocaleString()}</p>
          </div>
          <div className="text-right min-w-0">
            <p className="text-[9px] xs:text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-0.5">Refugo</p>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-ind-error tracking-tight truncate">{stats.totalBad.toLocaleString()}</p>
          </div>
          <div className="hidden xs:block h-8 sm:h-12 w-px bg-white/10 flex-shrink-0"></div>
          <Button
            onClick={() => setShowRawValues(!showRawValues)}
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex text-[10px] xs:text-xs"
          >
            {showRawValues ? 'Percentuais' : 'Detalhes OEE'}
          </Button>
        </div>
      </Card>

      {/* KPI Row - 2x2 on mobile, responsive text */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="relative overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/[0.02] transition-all group p-3 xs:p-4 sm:p-6">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${idx === 0 ? 'bg-pb-white' : idx === 3 ? 'bg-ind-ok' : 'bg-transparent group-hover:bg-white/10'}`}></div>
            <div className="flex justify-between items-start mb-1 xs:mb-2">
              <p className="text-[8px] xs:text-[10px] font-bold text-pb-gray uppercase tracking-[0.1em] truncate pr-1">{kpi.label}</p>
              <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full flex-shrink-0 ${idx === 3 ? 'bg-ind-ok animate-pulse' : 'bg-white/20'}`}></div>
            </div>
            <p className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1 xs:mb-2 ${kpi.color} tracking-tighter truncate`}>{kpi.value}</p>
            <p className="text-[8px] xs:text-[10px] text-pb-gray font-mono uppercase tracking-wider truncate">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        {/* Production Chart */}
        <Card className="xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4 xs:mb-6 sm:mb-8">
            <div className="min-w-0">
              <h3 className="font-bold text-sm xs:text-base sm:text-xl tracking-wide text-pb-white flex items-center gap-2 xs:gap-3 truncate">
                <span className="w-1.5 xs:w-2 h-4 xs:h-6 bg-ind-ok rounded-sm flex-shrink-0"></span>
                <span className="truncate">Produção Horária</span>
              </h3>
              <p className="text-[9px] xs:text-[10px] text-pb-gray font-bold uppercase tracking-widest mt-1 ml-3 xs:ml-5 hidden xs:block">Últimas 24h</p>
            </div>
          </div>
          <div className="h-[220px] xs:h-[280px] sm:h-[350px] w-full flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORY}>
                <defs>
                  <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0E0E0E', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#DADADA', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="production" stroke="#FFFFFF" strokeWidth={2} fillOpacity={1} fill="url(#colorProduction)" activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Status Sidebar - Compact on mobile */}
        <div className="bg-pb-black rounded-lg p-3 xs:p-4 sm:p-6 text-pb-white flex flex-col justify-between border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 xs:w-32 xs:h-32 bg-ind-ok/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

          <div>
            <h3 className="font-bold text-sm xs:text-base sm:text-xl mb-3 xs:mb-6 tracking-wide text-pb-white flex items-center gap-2">
              <svg className="w-4 h-4 xs:w-5 xs:h-5 text-ind-ok flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <span className="truncate">Status Industrial</span>
            </h3>
            <div className="space-y-2 xs:space-y-4">
              <div className="flex justify-between items-center p-2 xs:p-4 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[9px] xs:text-xs font-bold text-pb-gray uppercase tracking-widest">Ciclo Médio</span>
                <span className="text-lg xs:text-2xl font-mono font-bold text-pb-white">42.8s</span>
              </div>
              <div className="flex justify-between items-center p-2 xs:p-4 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[9px] xs:text-xs font-bold text-pb-gray uppercase tracking-widest">Consumo</span>
                <span className="text-lg xs:text-2xl font-mono font-bold text-pb-white">1.2 MW/h</span>
              </div>

              <div className="pt-3 xs:pt-6 border-t border-white/10">
                <h4 className="text-[9px] xs:text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-2 xs:mb-4 flex items-center justify-between gap-2">
                  <span className="truncate">Alertas</span>
                  <span className="bg-ind-error/20 text-ind-error text-[8px] xs:text-[9px] px-1.5 xs:px-2 py-0.5 rounded-full flex-shrink-0">{cells.filter(c => c.status === 'STOPPED').length}</span>
                </h4>
                <div className="space-y-1.5 xs:space-y-2">
                  {cells.filter(c => c.status === 'STOPPED').slice(0, 3).map(c => (
                    <div key={c.id} className="flex items-center space-x-2 xs:space-x-3 text-[10px] xs:text-xs bg-ind-error/10 p-2 xs:p-3 rounded border-l-2 border-ind-error">
                      <span className="text-pb-white font-mono font-bold w-6 xs:w-8 flex-shrink-0">{c.id.replace('C', '')}</span>
                      <span className="text-pb-lightGray truncate flex-1 min-w-0">{c.lastFault}</span>
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-ind-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-4 xs:mt-8 py-2 xs:py-4 uppercase tracking-widest text-[10px] xs:text-xs">
            Relatório PDF
          </Button>
        </div>
      </div>

      {/* Industrial Cell Table - Scroll horizontal on mobile, compact padding */}
      <Card noPadding className="overflow-hidden border border-white/5">
        <div className="p-3 xs:p-4 sm:p-6 border-b border-white/5 flex flex-col xs:flex-row xs:justify-between xs:items-center gap-2 bg-white/[0.02]">
          <div className="min-w-0">
            <h3 className="font-bold text-sm xs:text-base sm:text-xl text-pb-white truncate">Matriz de Monitoramento</h3>
            <p className="text-[9px] xs:text-[10px] text-pb-gray font-bold uppercase tracking-widest mt-0.5 hidden xs:block">20 células</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span className="flex items-center gap-1 text-[9px] xs:text-[10px] text-pb-gray uppercase font-bold"><span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-ind-ok"></span> Ok</span>
            <span className="flex items-center gap-1 text-[9px] xs:text-[10px] text-pb-gray uppercase font-bold"><span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-ind-error"></span> Parado</span>
          </div>
        </div>
        <div className="overflow-x-auto -mx-px">
          <table className="w-full text-left min-w-[520px]">
            <thead className="bg-[#111] text-[9px] xs:text-[10px] font-bold text-[#888] uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">Célula</th>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">Status</th>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">OEE</th>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 hidden sm:table-cell">Boas</th>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 hidden sm:table-cell">Refugo</th>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">Temp.</th>
                <th className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-right w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs xs:text-sm">
              {displayCells.map(cell => (
                <tr
                  key={cell.id}
                  onClick={() => onCellClick(cell)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">
                    <div className="flex items-center space-x-2 xs:space-x-3 min-w-0">
                      <div className={`w-6 h-6 xs:w-8 xs:h-8 rounded flex items-center justify-center font-bold text-[10px] xs:text-xs font-mono flex-shrink-0 ${cell.status === 'OPERATIONAL' ? 'bg-white/10 text-pb-white' : 'bg-ind-error/20 text-ind-error'}`}>
                        {cell.id.replace('C', '')}
                      </div>
                      <span className="font-bold text-pb-white truncate">{cell.name}</span>
                    </div>
                  </td>
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">
                    <StatusBadge status={cell.status} size="sm" />
                  </td>
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4">
                    <span className={`font-mono font-bold ${cell.oee < 80 ? 'text-ind-error' : 'text-ind-ok'}`}>{cell.oee}%</span>
                  </td>
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 font-mono text-pb-gray/80 hidden sm:table-cell">{cell.goodPieces.toLocaleString()}</td>
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 font-mono text-ind-error/80 hidden sm:table-cell">{cell.badPieces.toLocaleString()}</td>
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-pb-gray font-mono">{cell.temperature.toFixed(0)}°</td>
                  <td className="px-2 xs:px-4 sm:px-6 py-2 xs:py-3 sm:py-4 text-right">
                    <div className="p-1.5 xs:p-2 rounded-full hover:bg-white/10 inline-flex">
                      <svg className="w-3 h-3 xs:w-4 xs:h-4 text-pb-gray group-hover:text-pb-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
