
import React, { useState, useMemo } from 'react';
import { MOCK_DAILY_HISTORY } from '../data';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Cell } from 'recharts';

const ProductionHistory: React.FC = () => {
  const [period, setPeriod] = useState<'7D' | '15D' | '30D'>('30D');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(MOCK_DAILY_HISTORY[MOCK_DAILY_HISTORY.length - 1]);

  const filteredData = useMemo(() => {
    const days = period === '7D' ? 7 : period === '15D' ? 15 : 30;
    return MOCK_DAILY_HISTORY.slice(-days);
  }, [period]);

  const stats = useMemo(() => {
    const count = filteredData.length;
    return {
      avgOee: filteredData.reduce((acc, d) => acc + d.oee, 0) / count,
      totalProd: filteredData.reduce((acc, d) => acc + d.production, 0),
      totalDowntime: filteredData.reduce((acc, d) => acc + d.downtime, 0),
      avgCycle: filteredData.reduce((acc, d) => acc + d.cycleTime, 0) / count,
    };
  }, [filteredData]);

  const handleExport = (type: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Relatório ${type} gerado com sucesso para o período de ${period}!`);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="font-luxury text-3xl tracking-wide">Análise de Performance</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Histórico consolidado de OEE e produtividade</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {(['7D', '15D', '30D'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  period === p ? 'bg-black text-gold shadow-md' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {p === '7D' ? '7 Dias' : p === '15D' ? '15 Dias' : '30 Dias'}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-gray-200 hidden lg:block mx-2"></div>

          <div className="flex gap-2">
            <button 
              onClick={() => handleExport('PDF')}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 border border-zinc-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 disabled:opacity-50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span>{isExporting ? 'Processando...' : 'Exportar PDF'}</span>
            </button>
            <button 
              onClick={() => handleExport('CSV')}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all"
            >
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'OEE Médio', val: stats.avgOee.toFixed(1) + '%', sub: 'Eficiência Período', color: 'text-black' },
          { label: 'Produção Total', val: (stats.totalProd / 1000).toFixed(1) + 'k', sub: 'Milhares de Peças', color: 'text-zinc-600' },
          { label: 'Downtime Acumulado', val: Math.floor(stats.totalDowntime / 60) + 'h ' + (stats.totalDowntime % 60) + 'm', sub: 'Tempo de Parada', color: 'text-red-500' },
          { label: 'Ciclo Médio', val: stats.avgCycle.toFixed(1) + 's', sub: 'Velocidade Média', color: 'text-gold' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{kpi.label}</p>
            <p className={`text-3xl font-luxury ${kpi.color}`}>{kpi.val}</p>
            <p className="text-[10px] text-zinc-400 font-medium uppercase mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-luxury text-2xl tracking-wide">Tendência de OEE</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Comparativo diário de eficiência industrial</p>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-gold mr-2"></div> OEE Real</div>
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-zinc-200 mr-2"></div> Meta (85%)</div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Fix: Cast 'data' to any to avoid TypeScript error on 'activePayload' property access in AreaChart onClick handler */}
              <AreaChart data={filteredData} onClick={(data: any) => data?.activePayload?.[0]?.payload && setSelectedDay(data.activePayload[0].payload)}>
                <defs>
                  <linearGradient id="colorOee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#D4AF37' }}
                  cursor={{ stroke: '#D4AF37', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="oee" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorOee)" />
                <Line type="monotone" dataKey="oee" stroke="#000" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day Detail Sidebar */}
        <div className="bg-zinc-900 rounded-3xl p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-luxury text-2xl text-gold">{selectedDay.date}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Detalhes do Dia Selecionado</p>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase text-zinc-300">
                {selectedDay.oee > 85 ? 'Excelente' : 'Regular'}
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Disponibilidade', val: selectedDay.availability + '%' },
                { label: 'Performance', val: selectedDay.performance + '%' },
                { label: 'Qualidade', val: selectedDay.quality + '%' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-zinc-200">{item.val}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gold transition-all duration-1000" style={{ width: item.val }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Peças</p>
                <p className="text-xl font-luxury text-zinc-200">{selectedDay.production.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Paradas</p>
                <p className="text-xl font-luxury text-red-400">{selectedDay.downtime}m</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="font-luxury text-2xl">Detalhamento Diário</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Registros granulares de eficiência e tempos</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Data</th>
                <th className="px-6 py-4">OEE</th>
                <th className="px-6 py-4">Disponib.</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Qualidade</th>
                <th className="px-6 py-4">Downtime</th>
                <th className="px-8 py-4 text-right">Volume Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredData.slice().reverse().map((day, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => setSelectedDay(day)}
                  className={`hover:bg-zinc-50 transition-colors cursor-pointer group ${selectedDay.fullDate === day.fullDate ? 'bg-zinc-50/50' : ''}`}
                >
                  <td className="px-8 py-5 font-bold text-black">{day.fullDate}</td>
                  <td className="px-6 py-5">
                    <span className={`font-bold ${day.oee < 80 ? 'text-red-500' : 'text-black'}`}>{day.oee}%</span>
                  </td>
                  <td className="px-6 py-5 text-zinc-500">{day.availability}%</td>
                  <td className="px-6 py-5 text-zinc-500">{day.performance}%</td>
                  <td className="px-6 py-5 text-zinc-500">{day.quality}%</td>
                  <td className={`px-6 py-5 font-medium ${day.downtime > 60 ? 'text-red-400' : 'text-zinc-400'}`}>
                    {day.downtime} min
                  </td>
                  <td className="px-8 py-5 text-right font-luxury text-zinc-600">
                    {day.production.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pb-20"></div>
    </div>
  );
};

export default ProductionHistory;
