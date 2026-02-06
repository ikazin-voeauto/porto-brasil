import React, { useState, useMemo } from 'react';
import { MOCK_ALERTS, MOCK_HEATMAP_DATA } from '../data';
import { Alert, AlertSeverity } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

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
        return <span className="px-2 py-1 bg-ind-error/20 text-ind-error text-[10px] font-bold uppercase rounded">Crítico</span>;
      case 'WARNING':
        return <span className="px-2 py-1 bg-ind-warn/20 text-ind-warn text-[10px] font-bold uppercase rounded">Atenção</span>;
      case 'INFO':
        return <span className="px-2 py-1 bg-ind-info/20 text-ind-info text-[10px] font-bold uppercase rounded">Info</span>;
      case 'RESOLVED':
        return <span className="px-2 py-1 bg-ind-ok/20 text-ind-ok text-[10px] font-bold uppercase rounded">Resolvido</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn pb-32">
      {/* Header & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Alertas Ativos Card */}
        <div className="lg:col-span-1 bg-pb-black text-pb-white p-8 rounded-lg flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-3xl mb-1 text-ind-warn">Alertas Ativos</h2>
            <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest">Painel de Incidências IIoT</p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-pb-gray">Críticos</span>
              <span className="text-2xl font-mono text-ind-error">{stats.critical}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-pb-gray">Advertências</span>
              <span className="text-2xl font-mono text-ind-warn">{stats.warning}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-pb-white/10">
              <span className="text-xs text-pb-gray">Resolvidos Hoje</span>
              <span className="text-2xl font-mono text-ind-ok">{stats.resolvedToday}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heatmap Card */}
            <Card className="lg:col-span-2">
              <h3 className="font-bold text-xl mb-6">Mapa de Calor: Ocorrências (24h)</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {MOCK_HEATMAP_DATA.map(data => (
                  <div key={data.id} className="flex flex-col items-center">
                    <div
                      className="w-full aspect-square rounded flex items-center justify-center font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: data.faultFrequency === 0 ? '#F5F6F2' : // offWhite
                          data.faultFrequency < 3 ? '#DADADA' : // lightGray
                            data.faultFrequency < 6 ? '#8C7A3E' : // warn
                              '#8E2A2A', // error
                        color: data.faultFrequency > 2 ? '#fff' : '#0E0E0E'
                      }}
                      title={`${data.faultFrequency} falhas`}
                    >
                      {data.id.replace('C', '')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center space-x-4 mt-4 text-[10px] text-pb-gray font-bold uppercase tracking-widest">
                <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-pb-offWhite rounded"></div><span>0</span></div>
                <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-pb-lightGray rounded"></div><span>1-2</span></div>
                <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-ind-warn rounded"></div><span>3-5</span></div>
                <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-ind-error rounded"></div><span>5+</span></div>
              </div>
            </Card>

            {/* Filters */}
            <Card>
              <h3 className="font-bold text-xl mb-6">Filtros</h3>
              <div className="space-y-2">
                {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilter(sev as any)}
                    className={`w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-widest text-left transition-all ${filter === sev
                      ? 'bg-pb-black text-pb-white'
                      : 'hover:bg-pb-lightGray/30 text-pb-gray'
                      }`}
                  >
                    {sev === 'ALL' ? 'Todos os Alertas' : sev}
                  </button>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-pb-lightGray">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-2">Total de Ocorrências</p>
                  <p className="text-4xl font-bold text-pb-black">{alerts.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredAlerts.map(alert => (
              <Card
                key={alert.id}
                className={`cursor-pointer transition-all border-l-4 ${alert.severity === 'CRITICAL' ? 'border-l-ind-error' :
                  alert.severity === 'WARNING' ? 'border-l-ind-warn' : 'border-l-ind-info'
                  } hover:shadow-md`}
                onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                noPadding
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className={`mt-1 p-2 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-ind-error/10 text-ind-error' :
                        alert.severity === 'WARNING' ? 'bg-ind-warn/10 text-ind-warn' : 'bg-ind-info/10 text-ind-info'
                        }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="font-bold text-pb-black">{alert.cellId}</span>
                          <span className="text-pb-gray text-xs">•</span>
                          <span className="text-xs text-pb-gray font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          <span className="text-pb-gray text-xs">•</span>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm font-medium text-pb-black">{alert.message}</p>
                      </div>
                    </div>
                    {alert.resolved ? (
                      <span className="px-3 py-1 bg-pb-lightGray/30 text-pb-gray text-[10px] font-bold uppercase rounded-full">Resolvido</span>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={(e) => handleResolve(alert.id, e)}>
                        Resolver
                      </Button>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedAlert === alert.id && !alert.resolved && (
                    <div className="mt-8 pt-6 border-t border-pb-lightGray animate-slideDown">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                          <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-2">Diagnóstico Detalhado</p>
                          <p className="text-sm text-pb-black leading-relaxed bg-pb-white p-4 rounded-lg border border-pb-lightGray">{alert.details}</p>
                        </div>
                        <div className="space-y-4">
                          <p className="text-[10px] font-bold text-pb-gray uppercase tracking-widest mb-2">Ações Sugeridas</p>
                          <ul className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-pb-gray">
                            <li className="flex items-center text-ind-warn"><svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Verificar Sensores</li>
                            <li className="flex items-center"><svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Reset de Firmware</li>
                            <li className="flex items-center"><svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Notificar Manutenção</li>
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
            <div className="py-32 text-center bg-pb-offWhite/50 rounded-lg">
              <div className="w-16 h-16 bg-pb-white rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-ind-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-bold text-xl mb-1 text-pb-black">Nenhuma Incidência Ativa</h3>
              <p className="text-[10px] text-pb-gray font-bold uppercase tracking-widest">Todas as células operando dentro dos parâmetros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsHistory;
