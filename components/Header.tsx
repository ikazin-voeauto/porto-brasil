
import React from 'react';
import { ViewType } from '../types';
import Logo from './Logo';

interface HeaderProps {
  currentView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const titles: Record<ViewType, string> = {
    DASHBOARD: 'Painel de Controle Estratégico',
    CELLS: 'Monitoramento de Células de Produção',
    ANALYTICS: 'Relatórios e OEE Histórico',
    ALERTS: 'Log de Alertas e Manutenção',
    OPERATOR: 'Terminal de Operação Industrial',
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center space-x-4">
        <div className="hidden lg:block">
           <Logo variant="icon" color="#000" className="w-8 h-8 opacity-20" />
        </div>
        <div className="h-8 w-px bg-zinc-100 hidden lg:block"></div>
        <div>
          <h2 className="text-xl font-luxury tracking-wide text-black">{titles[currentView]}</h2>
          <div className="flex items-center space-x-2 text-xs text-gray-400 uppercase tracking-tighter mt-1 font-medium">
            <span>Porto Brasil</span>
            <span>/</span>
            <span className="text-gold">{currentView}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex space-x-4">
          <button className="p-2 text-gray-400 hover:text-black transition-colors relative">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-gray-400 hover:text-black transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        
        <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-semibold text-black leading-none">Eng. Marcos Silva</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Gestor Industrial</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
            <img src="https://picsum.photos/seed/marcos/100/100" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
