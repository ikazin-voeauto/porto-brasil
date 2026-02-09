
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="hidden md:flex fixed bottom-0 right-0 left-64 h-10 bg-pb-black border-t border-pb-lightGray items-center justify-between px-8 py-2 z-40">
      <div className="text-[10px] text-white font-medium tracking-widest">
        PORTO BRASIL CERÂMICA • Desenvolvido por Ikazin® · Engenharia e Automação
      </div>
      <div className="text-[10px] text-white tracking-widest">
        VIVA O MOMENTO
      </div>
    </footer>
  );
};

export default Footer;
