
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
    <div className="p-6 space-y-6 pb-20">
      {/* Header Controls */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-pb-darkGray/50 backdrop-blur-sm border-white/5">
        <div className="flex items-end space-x-4">
          <div className="flex flex-col w-64">
            <label className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-1">Filtrar Unidade</label>
            <select
              value={filterCell}
              onChange={(e) => setFilterCell(e.target.value)}
              className="bg-[#111] border border-white/10 rounded px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all appearance-none"
            >
              <option value="ALL">Todas as Células (01-20)</option>
              {cells.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleRefresh}
            variant="primary"
            size="md"
            title="Atualizar Dados"
            className="hover:bg-white hover:text-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </Button>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-right">
            <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-1">Peças Boas</p>
            <p className="text-2xl font-bold text-ind-ok tracking-tight drop-shadow-[0_0_8px_rgba(47,111,62,0.3)]">{stats.totalGood.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-1">Refugo</p>
            <p className="text-2xl font-bold text-ind-error tracking-tight drop-shadow-[0_0_8px_rgba(142,42,42,0.3)]">{stats.totalBad.toLocaleString()}</p>
          </div>
          <div className="h-12 w-px bg-white/10"></div>
          <Button
            onClick={() => setShowRawValues(!showRawValues)}
            variant="secondary"
            size="sm"
          >
            {showRawValues ? 'Ver Percentuais' : 'Ver Detalhes OEE'}
          </Button>
        </div>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="relative overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/[0.02] transition-all group">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${idx === 0 ? 'bg-white' : idx === 3 ? 'bg-ind-ok' : 'bg-transparent group-hover:bg-white/10'}`}></div>
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] font-bold text-pb-gray uppercase tracking-[0.1em]">{kpi.label}</p>
              <div className={`w-2 h-2 rounded-full ${idx === 3 ? 'bg-ind-ok animate-pulse' : 'bg-white/20'}`}></div>
            </div>
            <p className={`text-6xl font-bold mb-2 ${kpi.color} tracking-tighter`}>{kpi.value}</p>
            <p className="text-[10px] text-pb-gray font-mono uppercase tracking-wider">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Production Chart */}
        <Card className="xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl tracking-wide text-white flex items-center gap-3">
                <span className="w-2 h-6 bg-ind-ok rounded-sm"></span>
                Produção Horária
              </h3>
              <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest mt-1 ml-5">Volume de peças processadas nas últimas 24h</p>
            </div>
          </div>
          <div className="h-[350px] w-full flex-1">
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

        {/* Quick Status Sidebar */}
        <div className="bg-pb-black rounded-lg p-6 text-white shadow-lg flex flex-col justify-between border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ind-ok/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div>
            <h3 className="font-bold text-xl mb-6 tracking-wide text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-ind-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Status Industrial
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-xs font-bold text-pb-gray uppercase tracking-widest">Ciclo Médio</span>
                <span className="text-2xl font-mono font-bold text-white">42.8s</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-xs font-bold text-pb-gray uppercase tracking-widest">Consumo</span>
                <span className="text-2xl font-mono font-bold text-white">1.2 MW/h</span>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-4 flex items-center justify-between">
                  Alertas Recentes
                  <span className="bg-ind-error/20 text-ind-error text-[9px] px-2 py-0.5 rounded-full">{cells.filter(c => c.status === 'STOPPED').length} Ativos</span>
                </h4>
                <div className="space-y-2">
                  {cells.filter(c => c.status === 'STOPPED').slice(0, 3).map(c => (
                    <div key={c.id} className="flex items-center space-x-3 text-xs bg-ind-error/10 p-3 rounded border-l-2 border-ind-error hover:bg-ind-error/20 transition-colors cursor-pointer">
                      <span className="text-white font-mono font-bold w-8">{c.id.replace('C', '')}</span>
                      <span className="text-pb-lightGray truncate flex-1">{c.lastFault}</span>
                      <svg className="w-4 h-4 text-ind-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-8 py-4 uppercase tracking-widest text-xs">
            Relatório PDF
          </Button>
        </div>
      </div>

      {/* Industrial Cell Table */}
      <Card noPadding className="overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="font-bold text-xl text-white">Matriz de Monitoramento</h3>
            <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest mt-1">Performance individual de todas as 20 células</p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[10px] text-pb-gray uppercase font-bold"><span className="w-2 h-2 rounded-full bg-ind-ok"></span> Operando</span>
            <span className="flex items-center gap-1 text-[10px] text-pb-gray uppercase font-bold"><span className="w-2 h-2 rounded-full bg-ind-error"></span> Parado</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#111] text-[10px] font-bold text-[#888] uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4">ID / Célula</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">OEE</th>
                <th className="px-6 py-4">Peças Boas</th>
                <th className="px-6 py-4">Refugo</th>
                <th className="px-6 py-4">Temp.</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {displayCells.map(cell => (
                <tr
                  key={cell.id}
                  onClick={() => onCellClick(cell)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs font-mono transition-colors ${cell.status === 'OPERATIONAL' ? 'bg-white/10 text-white' : 'bg-ind-error/20 text-ind-error'}`}>
                        {cell.id.replace('C', '')}
                      </div>
                      <span className="font-bold text-white group-hover:underline decoration-white/30 underline-offset-4">{cell.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={cell.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-lg ${cell.oee < 80 ? 'text-ind-error' : 'text-ind-ok'}`}>{cell.oee}%</span>
                      {cell.oee >= 80 && <svg className="w-3 h-3 text-ind-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-white/70">{cell.goodPieces.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-ind-error/80">{cell.badPieces.toLocaleString()}</td>
                  <td className="px-6 py-4 text-pb-gray font-mono">{cell.temperature.toFixed(0)}°C</td>
                  <td className="px-6 py-4 text-right">
                    <div className="p-2 rounded-full hover:bg-white/10 inline-flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4 text-pb-gray group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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
