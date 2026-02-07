
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const titles: Record<ViewType, string> = {
    DASHBOARD: 'PAINEL ESTRATÉGICO',
    CELLS: 'MONITORAMENTO DE CÉLULAS',
    ANALYTICS: 'HISTÓRICO DE PRODUÇÃO',
    ALERTS: 'GESTÃO DE ALERTAS',
    OPERATOR: 'TERMINAL DE OPERAÇÃO',
  };

  return (
    <header className="h-16 bg-pb-black border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-10 w-full">
      <div className="flex items-center">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-wide">{titles[currentView]}</h2>
          <div className="flex items-center space-x-2 text-[10px] text-pb-gray uppercase tracking-widest font-medium">
            <span>Porto Brasil</span>
            <span>/</span>
            <span className="text-white font-bold">{currentView}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex space-x-2">
          <button className="p-2 text-pb-gray hover:text-white hover:bg-white/5 rounded transition-colors relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-ind-error rounded-full ring-1 ring-pb-black"></span>
          </button>
          <button className="p-2 text-pb-gray hover:text-white hover:bg-white/5 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>

        <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
          <div className="text-right">
            <p className="text-xs font-bold text-white leading-none uppercase">Eng. Marcos Silva</p>
            <p className="text-[10px] text-pb-gray font-medium uppercase tracking-widest mt-0.5">Gestor Industrial</p>
          </div>
          <div className="w-8 h-8 rounded bg-white/10 border border-white/5 flex items-center justify-center overflow-hidden">
            <span className="font-bold text-xs text-pb-gray">MS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
