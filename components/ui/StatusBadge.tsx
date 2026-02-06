import React from 'react';

export type Status = 'OPERATIONAL' | 'WARNING' | 'STOPPED' | 'MAINTENANCE' | 'INFO';

interface StatusBadgeProps {
    status: Status | string;
    label?: string;
    size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
    const getStyles = (s: string) => {
        switch (s) {
            case 'OPERATIONAL': return 'bg-ind-ok/10 text-ind-ok border-ind-ok/20';
            case 'WARNING': return 'bg-ind-warn/10 text-ind-warn border-ind-warn/20';
            case 'STOPPED': return 'bg-ind-error/10 text-ind-error border-ind-error/20';
            case 'MAINTENANCE': return 'bg-blue-50 text-blue-600 border-blue-100'; // Using Tailwind default for Maintenance for now or map to Info
            case 'INFO': return 'bg-ind-info/10 text-ind-info border-ind-info/20';
            default: return 'bg-pb-lightGray/30 text-pb-gray border-pb-lightGray';
        }
    };

    const labels: Record<string, string> = {
        OPERATIONAL: 'OPERACIONAL',
        WARNING: 'ATENÇÃO',
        STOPPED: 'PARADA',
        MAINTENANCE: 'MANUTENÇÃO',
        INFO: 'INFO',
    };

    const style = getStyles(status);
    const displayText = label || labels[status] || status;
    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

    return (
        <span className={`inline-flex items-center justify-center font-bold uppercase tracking-wider rounded border ${style} ${sizeClasses}`}>
            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${status === 'STOPPED' ? 'animate-pulse bg-current' : 'bg-current'}`}></div>
            {displayText}
        </span>
    );
};

export default StatusBadge;
