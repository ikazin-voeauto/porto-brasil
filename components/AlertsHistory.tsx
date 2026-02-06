
import React, { useState, useMemo } from 'react';
import { MOCK_ALERTS, MOCK_HEATMAP_DATA } from '../data';
import { Alert, AlertSeverity } from '../types';

const AlertsHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const filteredAlerts = useMemo(() => {
    return filter === 'ALL' ? alerts : alerts.filter(a => a.severity === filter);
  }, [alerts, filter]);

  const stats = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      warning: alerts.filter(a => a.severity === 'WARNING').length,
      info: alerts.filter(a => a.severity === 'INFO').length,
      resolvedToday: 12 // Mock constant for UI
    };
  }, [alerts]);

  const handleResolve = (id: string) => {
    // Visual feedback of resolution
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, severity: 'RESOLVED' as AlertSeverity } : a));
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  const getSeverityStyles = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500 text-white shadow-lg shadow-red-200';
      case 'WARNING': return 'bg-gold text-black shadow-lg shadow-gold/20';
      case 'INFO': return 'bg-zinc-100 text-zinc-500';
      case 'RESOLVED': return 'bg-green-500 text-white opacity-50 transition-opacity duration-1000';
      default: return 'bg-zinc-100 text-zinc-500';
    }
  };

  const getHeatmapColor = (freq: number, isCritical: boolean) => {
    if (isCritical) return 'bg-red-600 animate-pulse ring-4 ring-red-100';
    if (freq > 7) return 'bg-orange-500';
    if (freq > 4) return 'bg-gold';
    if (freq > 0) return 'bg-zinc-300';
    return 'bg-zinc-100';
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn pb-32">
      {/* Header & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-black text-white p-8 rounded-[32px] flex flex-col justify-between shadow-2xl">
          <div>
            <h2 className="font-luxury text-3xl mb-1 text-gold">Alertas Ativos</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Painel de Incidências IIoT</p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Críticos</span>
              <span className="text-2xl font-luxury text-red-500">{stats.critical}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">Advertências</span>
              <span className="text-2xl font-luxury text-gold">{stats.warning}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-xs text-zinc-400">Resolvidos Hoje</span>
              <span className="text-2xl font-luxury text-green-500">{stats.resolvedToday}</span>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-luxury text-2xl">Mapa de Calor Industrial</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Frequência de falhas por célula (24h)</p>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
               <div className="flex items-center"><div className="w-3 h-3 rounded bg-zinc-100 mr-2"></div> Estável</div>
               <div className="flex items-center"><div className="w-3 h-3 rounded bg-red-600 mr-2"></div> Crítico</div>
            </div>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {MOCK_HEATMAP_DATA.map(cell => (
              <div 
                key={cell.id}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all cursor-help group relative ${getHeatmapColor(cell.faultFrequency, cell.activeCritical)}`}
              >
                <span className={`text-[10px] font-bold ${cell.faultFrequency > 4 || cell.activeCritical ? 'text-white' : 'text-zinc-400'}`}>
                  {cell.id.replace('C', '')}
                </span>
                
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black text-white p-3 rounded-xl text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                   <p className="font-bold border-b border-white/10 pb-1 mb-1">{cell.id}</p>
                   <p>Falhas: {cell.faultFrequency}</p>
                   <p>Status: {cell.activeCritical ? 'Parada' : 'Operando'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas List & Filters */}
      <div className="bg-white rounded-[32px] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-2">
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all border ${
                  filter === f ? 'bg-black text-gold border-black' : 'text-zinc-400 border-zinc-100 hover:border-zinc-300'
                }`}
              >
                {f === 'ALL' ? 'Todos' : f}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Sincronizado com Node-RED às {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="divide-y divide-zinc-50">
          {filteredAlerts.length > 0 ? filteredAlerts.map(alert => (
            <div key={alert.id} className={`p-6 transition-all ${expandedAlert === alert.id ? 'bg-zinc-50/50' : 'hover:bg-zinc-50/30'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${getSeverityStyles(alert.severity)}`}>
                    <span className="text-[10px] font-bold uppercase">{alert.cellId}</span>
                    <svg className="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-zinc-100 rounded text-zinc-500">{alert.errorCode}</span>
                      <h4 className="font-bold text-zinc-900">{alert.message}</h4>
                    </div>
                    <div className="flex items-center space-x-4 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      <span>{alert.timestamp}</span>
                      <span>•</span>
                      <span>Duração: {alert.duration || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                    className="p-2 text-zinc-300 hover:text-black transition-colors"
                  >
                    <svg className={`w-5 h-5 transition-transform ${expandedAlert === alert.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className="px-6 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Resolver
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedAlert === alert.id && (
                <div className="mt-8 pt-6 border-t border-zinc-100 animate-slideDown">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Diagnóstico Detalhado</p>
                      <p className="text-sm text-zinc-600 leading-relaxed bg-white p-4 rounded-2xl border border-zinc-100">{alert.details}</p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Ações Sugeridas</p>
                      <ul className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        <li className="flex items-center text-gold"><svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Verificar Sensores</li>
                        <li className="flex items-center"><svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Reset de Firmware</li>
                        <li className="flex items-center"><svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Notificar Manutenção</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="py-32 text-center bg-zinc-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                 <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-luxury text-xl mb-1">Nenhuma Incidência Ativa</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Todas as células operando dentro dos parâmetros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsHistory;
