
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 right-0 left-64 h-10 bg-pb-white border-t border-pb-lightGray flex items-center justify-between px-8 z-40">
      <div className="text-[10px] text-pb-gray font-medium tracking-widest">
        PORTO BRASIL CERÂMICA • SISTEMA DE MONITORAMENTO INTEGRADO
      </div>
      <div className="text-xs text-pb-black tracking-widest">
        Viva o Momento
      </div>
    </footer>
  );
};

export default Footer;
