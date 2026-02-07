
import React from 'react';
import { ViewType } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    {
      id: 'DASHBOARD', label: 'DASHBOARD', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
      )
    },
    {
      id: 'CELLS', label: 'CÉLULAS', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      )
    },
    {
      id: 'OPERATOR', label: 'CONTAGEM', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      id: 'ANALYTICS', label: 'HISTÓRICO', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      )
    },
    {
      id: 'ALERTS', label: 'ALERTAS', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      )
    },
  ];

  return (
    <div className="w-64 bg-pb-black text-pb-white flex flex-col h-full shrink-0 border-r border-white/5">
      <div className="p-6 h-20 flex items-center gap-2 border-b border-white/5">
        <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg shrink-0">
          <Logo variant="icon" className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-sm tracking-widest uppercase truncate text-white">Porto Brasil</h1>
          <p className="text-[10px] text-pb-gray uppercase truncate tracking-wider">Monitoramento</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-6 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewType)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded text-sm font-medium transition-all group ${currentView === item.id
              ? 'bg-pb-darkGray text-white border-l-2 border-white'
              : 'text-pb-gray hover:text-white hover:bg-white/5'
              }`}
          >
            <span className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-pb-gray group-hover:text-white'}`}>
              {item.icon}
            </span>
            <span className="tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-2 text-ind-ok px-4 mb-4">
          <div className="w-2 h-2 rounded-full bg-ind-ok animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Sistema Online</span>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded text-pb-gray hover:text-white hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-10V5a3 3 0 00-6 0v1" /></svg>
          <span className="text-sm font-medium">SAIR</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
