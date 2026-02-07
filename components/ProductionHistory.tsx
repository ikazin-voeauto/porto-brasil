import React, { useState } from 'react';
import { MOCK_DAILY_HISTORY } from '../data';
import { jsPDF } from 'jspdf';
import Card from './ui/Card';
import Button from './ui/Button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const ProductionHistory: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '15D' | '30D'>('7D');

  // Filter data based on time range
  const historyData = MOCK_DAILY_HISTORY.slice(0, timeRange === '7D' ? 7 : timeRange === '15D' ? 15 : 30).reverse();

  const stats = {
    totalProd: historyData.reduce((acc, curr) => acc + curr.production, 0),
    avgOee: (historyData.reduce((acc, curr) => acc + curr.oee, 0) / historyData.length).toFixed(1),
    downtime: historyData.reduce((acc, curr) => acc + curr.downtime, 0)
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Relatório de Produção - Porto Brasil", 10, 20);
    doc.setFontSize(12);
    doc.text(`Período: Últimos ${timeRange}`, 10, 30);
    doc.text(`Produção Total: ${stats.totalProd}`, 10, 40);
    doc.text(`OEE Médio: ${stats.avgOee}%`, 10, 50);
    doc.save("relatorio_producao.pdf");
  };

  const handleExportCSV = () => {
    const headers = "Data,Produção,OEE,Paradas(min)\n";
    const rows = historyData.map(d => `${d.fullDate},${d.production},${d.oee},${d.downtime}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "producao.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6 pb-20 bg-pb-black min-h-screen text-pb-white font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Histórico de Produção</h2>
          <p className="text-sm font-bold text-pb-gray uppercase tracking-widest mt-1">Análise de Performance Industrial</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-[#111] p-1 rounded-lg border border-white/5">
            {(['7D', '15D', '30D'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${timeRange === range ? 'bg-pb-darkGray text-white shadow-sm border border-white/10' : 'text-pb-gray hover:text-white'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportCSV} className="border border-white/10 hover:bg-white/5">
            CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPDF} className="shadow-[0_0_15px_rgba(50,250,250,0.2)]">
            PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 bg-pb-darkGray border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <p className="text-[10px] md:text-xs font-bold text-pb-gray uppercase tracking-widest mb-1 md:mb-2">Produção Total</p>
          <div className="text-2xl md:text-4xl font-mono font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            {stats.totalProd.toLocaleString()}
          </div>
          <p className="text-[10px] md:text-xs text-ind-ok mt-1 md:mt-2 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            +12.5% vs anterior
          </p>
        </Card>

        <Card className="p-4 md:p-6 bg-pb-darkGray border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-ind-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <p className="text-[10px] md:text-xs font-bold text-pb-gray uppercase tracking-widest mb-1 md:mb-2">OEE Médio</p>
          <div className="text-2xl md:text-4xl font-mono font-bold text-white tracking-tighter">
            {stats.avgOee}<span className="text-lg md:text-xl text-pb-gray ml-1">%</span>
          </div>
          <div className="w-full bg-[#111] h-1.5 mt-2 md:mt-4 rounded-full overflow-hidden">
            <div className="h-full bg-ind-ok shadow-[0_0_10px_rgba(76,175,80,0.5)]" style={{ width: `${stats.avgOee}%` }}></div>
          </div>
        </Card>

        <Card className="p-4 md:p-6 bg-pb-darkGray border-white/5 relative overflow-hidden group col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-ind-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-[10px] md:text-xs font-bold text-pb-gray uppercase tracking-widest mb-1 md:mb-2">Tempo de Parada</p>
          <div className="text-2xl md:text-4xl font-mono font-bold text-white tracking-tighter">
            {stats.downtime} <span className="text-lg md:text-xl text-pb-gray">min</span>
          </div>
          <p className="text-[10px] md:text-xs text-ind-error mt-1 md:mt-2 font-bold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            +5% vs anterior
          </p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-auto min-h-[300px] md:min-h-[400px]">
        {/* Production Trend */}
        <Card className="p-4 md:p-6 bg-pb-darkGray border-white/5 flex flex-col h-[300px] md:h-auto">
          <h3 className="text-[10px] md:text-sm font-bold text-pb-gray uppercase tracking-widest mb-4 md:mb-6">Tendência de Produção</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00E5FF' }}
                />
                <Area type="monotone" dataKey="production" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* OEE Analysis */}
        <Card className="p-4 md:p-6 bg-pb-darkGray border-white/5 flex flex-col h-[300px] md:h-auto">
          <h3 className="text-[10px] md:text-sm font-bold text-pb-gray uppercase tracking-widest mb-4 md:mb-6">Análise de OEE (%)</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="oee" radius={[4, 4, 0, 0]}>
                  {historyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.oee >= 85 ? '#4CAF50' : entry.oee >= 70 ? '#FFC107' : '#F44336'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="overflow-hidden bg-pb-darkGray border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-pb-gray bg-[#111]">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">OEE</th>
                <th className="px-6 py-4">Disponibilidade</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Qualidade</th>
                <th className="px-6 py-4">Downtime</th>
                <th className="px-6 py-4 text-right">Volume Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {historyData.slice().reverse().map((day, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-5 font-bold text-white font-mono">{day.fullDate}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${day.oee >= 80 ? 'bg-ind-ok shadow-[0_0_5px_currentColor]' : day.oee >= 70 ? 'bg-ind-warn' : 'bg-ind-error'}`}></div>
                      <span className={`font-bold ${day.oee < 70 ? 'text-ind-error' : 'text-white'}`}>{day.oee}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-pb-gray">{day.availability}%</td>
                  <td className="px-6 py-5 text-pb-gray">{day.performance}%</td>
                  <td className="px-6 py-5 text-pb-gray">{day.quality}%</td>
                  <td className={`px-6 py-5 font-medium ${day.downtime > 60 ? 'text-ind-error' : 'text-pb-gray'}`}>
                    {day.downtime} min
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-white tracking-tight">
                    {day.production.toLocaleString()}
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

export default ProductionHistory;
