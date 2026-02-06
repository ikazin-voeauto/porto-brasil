
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
    { label: 'OEE Global', value: stats.avgOee.toFixed(1) + '%', sub: 'Eficiência Total', color: 'text-pb-black' },
    { label: 'Disponibilidade', value: stats.avgAvail.toFixed(1) + '%', sub: 'Tempo Ativo', color: 'text-pb-gray' },
    { label: 'Performance', value: stats.avgPerf.toFixed(1) + '%', sub: 'Velocidade', color: 'text-pb-gray' },
    { label: 'Qualidade', value: stats.avgQual.toFixed(1) + '%', sub: 'Peças Conformadas', color: 'text-ind-warn' },
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6 pb-20">
      {/* Header Controls */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-end space-x-4">
          <div className="flex flex-col w-64">
            <label className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-1">Filtrar Unidade</label>
            <select
              value={filterCell}
              onChange={(e) => setFilterCell(e.target.value)}
              className="bg-pb-offWhite border border-pb-lightGray rounded px-3 py-2 text-sm font-semibold focus:outline-none focus:border-pb-black appearance-none"
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
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </Button>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-right">
            <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest">Peças Boas</p>
            <p className="text-xl font-bold text-ind-ok">{stats.totalGood.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest">Refugo (Bad)</p>
            <p className="text-xl font-bold text-ind-error">{stats.totalBad.toLocaleString()}</p>
          </div>
          <div className="h-10 w-px bg-pb-lightGray"></div>
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
          <Card key={idx} className="cursor-pointer hover:border-pb-black transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-bold text-pb-gray uppercase tracking-[0.1em]">{kpi.label}</p>
              <div className="w-1.5 h-1.5 rounded-full bg-pb-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <p className={`text-5xl font-bold mb-1 ${kpi.color} tracking-tight`}>{kpi.value}</p>
            <p className="text-[10px] text-pb-gray font-mono uppercase">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Production Chart */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl tracking-wide">Produção Horária</h3>
              <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest mt-1">Volume de peças processadas nas últimas 24h</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B6B6B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C1C1C', border: 'none', borderRadius: '4px', color: '#fff' }}
                  itemStyle={{ color: '#DADADA' }}
                  cursor={{ stroke: '#0E0E0E', strokeWidth: 1 }}
                />
                <Area type="step" dataKey="production" stroke="#0E0E0E" strokeWidth={2} fill="#F5F6F2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Status Sidebar */}
        <div className="bg-pb-black rounded-lg p-6 text-pb-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xl mb-6 tracking-wide">Status Industrial</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-pb-white/5 rounded border border-pb-white/10">
                <span className="text-xs font-bold text-pb-gray uppercase tracking-widest">Ciclo Médio</span>
                <span className="text-xl font-mono font-bold text-pb-white">42.8s</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-pb-white/5 rounded border border-pb-white/10">
                <span className="text-xs font-bold text-pb-gray uppercase tracking-widest">Consumo</span>
                <span className="text-xl font-mono font-bold text-pb-white">1.2 MW/h</span>
              </div>

              <div className="pt-4 border-t border-pb-white/10">
                <h4 className="text-[10px] font-bold text-pb-lightGray uppercase tracking-widest mb-4">Alertas Recentes</h4>
                <div className="space-y-2">
                  {cells.filter(c => c.status === 'STOPPED').slice(0, 3).map(c => (
                    <div key={c.id} className="flex items-center space-x-3 text-xs bg-ind-error/20 p-2 rounded border border-ind-error/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-ind-error animate-pulse"></div>
                      <span className="text-pb-lightGray font-mono font-bold">{c.id}</span>
                      <span className="text-pb-lightGray truncate">{c.lastFault}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button variant="secondary" className="w-full mt-6 bg-transparent border-pb-gray text-pb-gray hover:bg-pb-white hover:text-pb-black hover:border-pb-white">
            Exportar Relatório PDF
          </Button>
        </div>
      </div>

      {/* Industrial Cell Table */}
      <Card noPadding className="overflow-hidden">
        <div className="p-6 border-b border-pb-lightGray flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">Matriz de Monitoramento</h3>
            <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest mt-1">Performance individual de todas as 20 células</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-pb-offWhite text-[10px] font-bold text-pb-gray uppercase tracking-widest border-b border-pb-lightGray">
              <tr>
                <th className="px-6 py-3">ID / Célula</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">OEE</th>
                <th className="px-6 py-3">Peças Boas</th>
                <th className="px-6 py-3">Refugo</th>
                <th className="px-6 py-3">Temp.</th>
                <th className="px-6 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pb-lightGray text-sm">
              {displayCells.map(cell => (
                <tr
                  key={cell.id}
                  onClick={() => onCellClick(cell)}
                  className="hover:bg-pb-offWhite transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-pb-lightGray flex items-center justify-center font-bold text-pb-gray text-xs font-mono">
                        {cell.id.replace('C', '')}
                      </div>
                      <span className="font-bold text-pb-black">{cell.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={cell.status} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono font-bold ${cell.oee < 80 ? 'text-ind-error' : 'text-pb-black'}`}>{cell.oee}%</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-pb-black">{cell.goodPieces.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-ind-error">{cell.badPieces.toLocaleString()}</td>
                  <td className="px-6 py-4 text-pb-gray font-mono">{cell.temperature.toFixed(0)}°C</td>
                  <td className="px-6 py-4 text-right">
                    <svg className="w-5 h-5 ml-auto text-pb-gray group-hover:text-pb-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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
