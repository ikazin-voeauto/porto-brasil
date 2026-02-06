
import React, { useState, useMemo } from 'react';
import { ProductionCell } from '../types';
import { MOCK_HISTORY } from '../data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
    { label: 'OEE Global', value: stats.avgOee.toFixed(1) + '%', sub: 'Eficiência Total', color: 'text-black' },
    { label: 'Disponibilidade', value: stats.avgAvail.toFixed(1) + '%', sub: 'Tempo Ativo', color: 'text-zinc-600' },
    { label: 'Performance', value: stats.avgPerf.toFixed(1) + '%', sub: 'Velocidade', color: 'text-zinc-600' },
    { label: 'Qualidade', value: stats.avgQual.toFixed(1) + '%', sub: 'Peças Conformadas', color: 'text-gold' },
  ];

  const handleRefresh = () => {
    // In a real app, this would trigger an API call. 
    // Here we just trigger a re-render by calling the parent's setter if we had it, 
    // but the interval in App.tsx already simulates this.
    window.location.reload(); // Quick simulation of refresh for prototype
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn pb-20">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Filtrar Unidade</label>
            <select 
              value={filterCell}
              onChange={(e) => setFilterCell(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-gold"
            >
              <option value="ALL">Todas as Células (01-20)</option>
              {cells.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleRefresh}
            className="mt-5 p-2 bg-zinc-900 text-gold rounded-lg hover:bg-black transition-colors"
            title="Atualizar Dados"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peças Boas</p>
            <p className="text-xl font-luxury text-green-600">{stats.totalGood.toLocaleString()}</p>
          </div>
          <div className="text-right">
            {/* Fix: Corrected missing equals sign and quotes for className to prevent breaking the JSX parser */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Refugo (Bad)</p>
            <p className="text-xl font-luxury text-red-500">{stats.totalBad.toLocaleString()}</p>
          </div>
          <div className="h-10 w-px bg-gray-100"></div>
          <button 
            onClick={() => setShowRawValues(!showRawValues)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            {showRawValues ? 'Ver Percentuais' : 'Ver Detalhes OEE'}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            onClick={() => setShowRawValues(!showRawValues)}
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{kpi.label}</p>
              <div className="w-2 h-2 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <p className={`text-5xl font-luxury mb-1 ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Production Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-luxury text-2xl tracking-wide">Produção Horária</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Volume de peças processadas nas últimas 24h</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_HISTORY}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                  cursor={{ stroke: '#D4AF37', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="production" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" />
                <Line type="monotone" dataKey="production" stroke="#D4AF37" strokeWidth={2} dot={{ r: 4, fill: '#D4AF37' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Status Sidebar */}
        <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl">
          <h3 className="font-luxury text-2xl mb-6">Status Industrial</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tempo de Ciclo Médio</span>
              <span className="text-xl font-luxury text-gold">42.8s</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Consumo Energético</span>
              <span className="text-xl font-luxury text-gold">1.2 MW/h</span>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Alertas Recentes</h4>
              <div className="space-y-3">
                {cells.filter(c => c.status === 'STOPPED').slice(0, 3).map(c => (
                  <div key={c.id} className="flex items-center space-x-3 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-zinc-300 font-bold">{c.id}</span>
                    <span className="text-red-400 truncate">{c.lastFault}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 mt-6 border border-gold text-gold font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-gold hover:text-black transition-all">
              Exportar Relatório PDF
            </button>
          </div>
        </div>
      </div>

      {/* Industrial Cell Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-luxury text-2xl">Matriz de Monitoramento</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Performance individual de todas as 20 células</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">ID / Célula</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">OEE</th>
                <th className="px-6 py-4">Peças Boas</th>
                <th className="px-6 py-4">Refugo</th>
                <th className="px-6 py-4">Temp.</th>
                <th className="px-8 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {displayCells.map(cell => (
                <tr 
                  key={cell.id} 
                  onClick={() => onCellClick(cell)}
                  className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 text-xs">
                        {cell.id.replace('C', '')}
                      </div>
                      <span className="font-bold text-black">{cell.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      cell.status === 'OPERATIONAL' ? 'bg-green-50 text-green-600' :
                      cell.status === 'STOPPED' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {cell.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${cell.oee < 80 ? 'text-red-500' : 'text-black'}`}>{cell.oee}%</span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${cell.oee < 80 ? 'bg-red-500' : 'bg-gold'}`} style={{ width: `${cell.oee}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-zinc-600">{cell.goodPieces.toLocaleString()}</td>
                  <td className="px-6 py-5 text-red-400 font-medium">{cell.badPieces.toLocaleString()}</td>
                  <td className="px-6 py-5 text-zinc-400 font-mono">{cell.temperature.toFixed(0)}°C</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 opacity-0 group-hover:opacity-100 text-gold transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
