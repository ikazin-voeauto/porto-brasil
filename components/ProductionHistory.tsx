import React, { useState } from 'react';
import { MOCK_DAILY_HISTORY } from '../data';
import { jsPDF } from 'jspdf';
import Card from './ui/Card';
import Button from './ui/Button';

const ProductionHistory: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '15D' | '30D'>('7D');
  const [selectedDay, setSelectedDay] = useState<any>(null);

  // Map Daily History to expected format
  const mappedData = MOCK_DAILY_HISTORY.map(d => ({
    ...d,
    timestamp: d.date // Aliasing date to timestamp for existing chart props
  }));

  const filteredData = mappedData.slice(0, timeRange === '7D' ? 7 : timeRange === '15D' ? 15 : 30);

  const stats = {
    totalProd: filteredData.reduce((acc, curr) => acc + curr.production, 0),
    avgOee: (filteredData.reduce((acc, curr) => acc + curr.oee, 0) / filteredData.length).toFixed(1),
    downtime: filteredData.reduce((acc, curr) => acc + curr.downtime, 0)
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
    const rows = filteredData.map(d => `${d.timestamp},${d.production},${d.oee},${d.downtime}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "producao.csv";
    a.click();
  };

  return (
    <div className="p-6 space-y-6 pb-20">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-pb-black">Histórico de Produção</h2>
          <p className="text-xs font-bold text-pb-gray uppercase tracking-widest">Relatório Analítico</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            Exportar CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportPDF}>
            Exportar PDF
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-pb-lightGray text-[10px] font-bold uppercase tracking-widest text-pb-gray">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">OEE</th>
                <th className="px-6 py-4">Disponibilidade</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4">Qualidade</th>
                <th className="px-6 py-4">Downtime</th>
                <th className="px-6 py-4 text-right">Volume Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredData.slice().reverse().map((day, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`hover:bg-pb-offWhite transition-colors cursor-pointer group ${selectedDay?.timestamp === day.timestamp ? 'bg-pb-offWhite/50' : ''}`}
                >
                  <td className="px-6 py-5 font-bold text-pb-black">{day.fullDate || day.timestamp}</td>
                  <td className="px-6 py-5">
                    <span className={`font-bold ${day.oee < 80 ? 'text-ind-error' : 'text-pb-black'}`}>{day.oee}%</span>
                  </td>
                  <td className="px-6 py-5 text-pb-gray">{day.availability}%</td>
                  <td className="px-6 py-5 text-pb-gray">{day.performance}%</td>
                  <td className="px-6 py-5 text-pb-gray">{day.quality}%</td>
                  <td className={`px-6 py-5 font-medium ${day.downtime > 60 ? 'text-ind-error' : 'text-pb-gray'}`}>
                    {day.downtime} min
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-pb-black">
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
