import React from 'react';
import { ViewType } from '../types';

interface MobileNavProps {
    currentView: ViewType;
    setView: (view: ViewType) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView }) => {
    const navItems = [
        {
            id: 'DASHBOARD',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
            label: 'Painel'
        },
        {
            id: 'CELLS',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
            label: 'Células'
        },
        {
            id: 'OPERATOR',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            label: 'Contar'
        },
        {
            id: 'ANALYTICS',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
            label: 'Histórico'
        },
        {
            id: 'ALERTS',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
            label: 'Alertas'
        }
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-pb-black border-t border-white/5 z-50 safe-area-pb">
            <div className="flex justify-around items-center h-14 xs:h-16">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id as ViewType)}
                        className={`flex flex-col items-center justify-center w-full h-full gap-0.5 xs:space-y-1 min-w-0 px-1 ${currentView === item.id ? 'text-pb-white' : 'text-pb-gray'
                            }`}
                    >
                        <div className={`p-1 rounded-lg transition-colors flex items-center justify-center ${currentView === item.id ? 'bg-pb-white/10' : ''}`}>
                            <span className="w-5 h-5 xs:w-6 xs:h-6 [&>svg]:w-full [&>svg]:h-full block">{item.icon}</span>
                        </div>
                        <span className="text-[8px] xs:text-[9px] font-bold uppercase tracking-wider truncate w-full text-center">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileNav;
