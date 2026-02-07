
import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSent(true);
      setTimeout(onClose, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#111] w-full max-w-sm rounded-lg shadow-2xl border border-white/5 relative overflow-hidden animate-slideUp">
        <div className="p-8">
          <h3 className="text-xl font-bold text-white mb-2">Recuperar Acesso</h3>
          <p className="text-xs text-pb-gray mb-6 tracking-wide">
            Informe seu e-mail corporativo para receber as instruções de redefinição.
          </p>

          {!sent ? (
            <form onSubmit={handleRecover} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@portobrasil.com.br"
                className="w-full px-4 py-3 bg-pb-darkGray border border-white/10 rounded focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 text-sm text-white placeholder-pb-gray"
                required
              />
              <button
                type="submit"
                className="w-full py-4 bg-white text-pb-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-pb-lightGray transition-colors"
              >
                Enviar Instruções
              </button>
            </form>
          ) : (
            <div className="py-4 text-center">
              <div className="w-12 h-12 bg-ind-ok/10 text-ind-ok rounded-full flex items-center justify-center mx-auto mb-4 border border-ind-ok/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-bold text-white">E-mail enviado!</p>
              <p className="text-[10px] text-pb-gray uppercase mt-1">Verifique sua caixa de entrada</p>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pb-gray hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
