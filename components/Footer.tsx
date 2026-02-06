
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 right-0 left-64 h-10 bg-white border-t border-gray-100 flex items-center justify-between px-8 z-40">
      <div className="text-[10px] text-gray-400 font-medium tracking-widest">
        PORTO BRASIL CERÂMICA • SISTEMA DE MONITORAMENTO INTEGRADO
      </div>
      <div className="font-luxury italic text-xs text-black tracking-widest">
        Viva o Momento
      </div>
    </footer>
  );
};

export default Footer;
