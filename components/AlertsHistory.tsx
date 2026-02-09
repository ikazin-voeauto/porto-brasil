import React, { useState, useMemo } from 'react';
import { MOCK_ALERTS, MOCK_HEATMAP_DATA } from '../data';
import { Alert, AlertSeverity } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

const AlertsHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filter, setFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchesSeverity = filter === 'ALL' || a.severity === filter;
      const matchesSearch = a.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.cellName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.errorCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [alerts, filter, searchTerm]);

  const stats = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      warning: alerts.filter(a => a.severity === 'WARNING').length,
      info: alerts.filter(a => a.severity === 'INFO').length,
      resolvedToday: 12 // Mock constant for UI
    };
  }, [alerts]);

  const handleResolve = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Visual feedback of resolution
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, severity: 'RESOLVED' as AlertSeverity, resolved: true } : a));
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 1000);
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-1 bg-ind-error/20 text-ind-error text-[10px] font-bold uppercase rounded border border-ind-error/20">Crítico</span>;
      case 'WARNING':
        return <span className="px-2 py-1 bg-ind-warn/20 text-ind-warn text-[10px] font-bold uppercase rounded border border-ind-warn/20">Atenção</span>;
      case 'INFO':
        return <span className="px-2 py-1 bg-ind-info/20 text-ind-info text-[10px] font-bold uppercase rounded border border-ind-info/20">Info</span>;
      case 'RESOLVED':
        return <span className="px-2 py-1 bg-ind-ok/20 text-ind-ok text-[10px] font-bold uppercase rounded border border-ind-ok/20">Resolvido</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-3 xs:p-4 sm:p-6 space-y-3 xs:space-y-4 sm:space-y-6 pb-28 xs:pb-32">
      {/* Header & Quick Stats - Compact on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
        {/* Alertas Ativos Card */}
        <div className="lg:col-span-1 bg-pb-darkGray border border-white/5 text-pb-white p-3 xs:p-4 sm:p-6 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg xs:text-xl sm:text-2xl mb-0.5 xs:mb-1 text-pb-white">Alertas Ativos</h2>
            <p className="text-[9px] xs:text-[10px] text-pb-gray font-bold uppercase tracking-widest">Incidências</p>
          </div>
          <div className="mt-4 xs:mt-6 sm:mt-8 space-y-2 xs:space-y-4">
            <div className="flex justify-between items-center p-2 xs:p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[9px] xs:text-xs font-bold text-pb-gray uppercase tracking-wider">Críticos</span>
              <span className="text-xl xs:text-2xl font-mono font-bold text-ind-error">{stats.critical}</span>
            </div>
            <div className="flex justify-between items-center p-2 xs:p-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[9px] xs:text-xs font-bold text-pb-gray uppercase tracking-wider">Atenção</span>
              <span className="text-xl xs:text-2xl font-mono font-bold text-ind-warn">{stats.warning}</span>
            </div>
            <div className="flex justify-between items-center pt-3 xs:pt-4 border-t border-white/10">
              <span className="text-[9px] xs:text-xs font-bold text-pb-gray uppercase tracking-wider">Resolvidos</span>
              <span className="text-xl xs:text-2xl font-mono font-bold text-ind-ok">{stats.resolvedToday}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-3 xs:space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            {/* Heatmap Card - Dark theme, compact grid on mobile */}
            <Card className="lg:col-span-2 bg-pb-darkGray border-white/5">
              <h3 className="font-bold text-sm xs:text-base sm:text-lg text-pb-white mb-3 xs:mb-6 uppercase tracking-wider">Mapa de Calor (24h)</h3>
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-1 xs:gap-2">
                {MOCK_HEATMAP_DATA.map(data => (
                  <div key={data.id} className="flex flex-col items-center group">
                    <div
                      className="w-full aspect-square rounded flex items-center justify-center font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer relative overflow-hidden"
                      style={{
                        backgroundColor: data.faultFrequency === 0 ? '#1A1A1A' : // darkGray
                          data.faultFrequency < 3 ? '#333333' : // gray
                            data.faultFrequency < 6 ? 'rgba(255, 193, 7, 0.2)' : // warn low opacity
                              'rgba(244, 67, 54, 0.2)', // error low opacity
                        border: data.faultFrequency >= 6 ? '1px solid #F44336' :
                          data.faultFrequency >= 3 ? '1px solid #FFC107' :
                            '1px solid rgba(255,255,255,0.05)',
                        color: data.faultFrequency === 0 ? '#666' : '#fff'
                      }}
                      title={`${data.faultFrequency} falhas`}
                    >
                      {data.faultFrequency > 5 && <div className="absolute inset-0 bg-ind-error/10 animate-pulse"></div>}
                      <span className="relative z-10">{data.id.replace('C', '')}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center space-x-4 mt-6 text-[10px] text-pb-gray font-bold uppercase tracking-widest">
                <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-[#1A1A1A] border border-white/10 rounded"></div><span>0</span></div>
                <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-[#333] border border-white/10 rounded"></div><span>1-2</span></div>
                <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-ind-warn/20 border border-ind-warn rounded"></div><span>3-5</span></div>
                <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-ind-error/20 border border-ind-error rounded"></div><span>5+</span></div>
              </div>
            </Card>

            {/* Filters */}
            <Card className="bg-pb-darkGray border-white/5">
              <h3 className="font-bold text-lg text-white mb-6 uppercase tracking-wider">Filtros</h3>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar erro, código ou célula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded p-3 text-sm text-white placeholder-pb-gray focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="space-y-2">
                {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => {
                  const labels: Record<string, string> = { ALL: 'Todos', CRITICAL: 'Críticos', WARNING: 'Atenção', INFO: 'Info' };
                  return (
                    <button
                      key={sev}
                      onClick={() => setFilter(sev as any)}
                      className={`w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-widest text-left transition-all border ${filter === sev
                        ? 'bg-white text-pb-black border-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                        : 'bg-transparent border-white/10 text-pb-gray hover:border-white/30 hover:text-white'
                        }`}
                    >
                      {labels[sev]}
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredAlerts.map(alert => (
              <Card
                key={alert.id}
                className={`cursor-pointer transition-all border-l-[4px] bg-pb-darkGray border-y border-r border-white/5 ${alert.severity === 'CRITICAL' ? 'border-l-ind-error shadow-[inset_2px_0_0_0_rgba(244,67,54,0.1)]' :
                    alert.severity === 'WARNING' ? 'border-l-ind-warn shadow-[inset_2px_0_0_0_rgba(255,193,7,0.1)]' :
                      'border-l-ind-info shadow-[inset_2px_0_0_0_rgba(33,150,243,0.1)]'
                  } hover:bg-white/[0.02] hover:translate-x-1`}
                onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                noPadding
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 p-2 rounded-lg border ${alert.severity === 'CRITICAL' ? 'bg-ind-error/10 text-ind-error border-ind-error/20' :
                          alert.severity === 'WARNING' ? 'bg-ind-warn/10 text-ind-warn border-ind-warn/20' :
                            'bg-ind-info/10 text-ind-info border-ind-info/20'
                        }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-bold text-white text-sm">{alert.cellName}</span>
                          <span className="text-pb-gray text-[10px]">•</span>
                          <span className="text-[10px] text-pb-gray font-mono uppercase tracking-widest">{alert.id}</span>
                          <span className="text-pb-gray text-[10px]">•</span>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm font-bold text-white/90">{alert.message}</p>
                        <p className="text-xs text-pb-gray mt-1 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    {alert.resolved ? (
                      <span className="px-3 py-1 bg-white/5 text-pb-gray text-[10px] font-bold uppercase rounded-full border border-white/10">Resolvido</span>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={(e) => handleResolve(alert.id, e)} className="border border-white/10 hover:bg-white/10">
                        Resolver
                      </Button>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedAlert === alert.id && !alert.resolved && (
                    <div className="mt-6 pt-6 border-t border-white/5 animate-slideDown">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-2">Diagnóstico Detalhado</p>
                          <div className="text-sm text-pb-lightGray leading-relaxed bg-[#111] p-4 rounded-lg border border-white/5 font-mono">
                            <span className="text-ind-error block mb-2 opacity-70">Error Code: {alert.errorCode}</span>
                            {alert.details}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-2">Ações Sugeridas</p>
                          <ul className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-white/80">
                            <li className="flex items-center p-2 rounded bg-ind-warn/10 border border-ind-warn/20 text-ind-warn">
                              <svg className="w-3 h-3 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              Verificar Sensores
                            </li>
                            <li className="flex items-center p-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                              <svg className="w-3 h-3 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              Reset de Firmware
                            </li>
                            <li className="flex items-center p-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                              <svg className="w-3 h-3 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              Notificar Manutenção
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="py-20 text-center bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-ind-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-1 text-white">Nenhuma Incidência Encontrada</h3>
              <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest">Sistemas operando normalmente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsHistory;
