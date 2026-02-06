
import React, { useState } from 'react';
import ForgotPasswordModal from './ForgotPasswordModal';
import Logo from './Logo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  const handleBiometricClick = () => {
    setIsBiometricLoading(true);
    setTimeout(() => {
      setIsBiometricLoading(false);
      onLogin(); // Simulate successful face/touch ID login
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5DC] p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-gold/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md animate-fadeIn z-10">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-14 border border-white/50 backdrop-blur-sm">
          {/* Logo Section */}
          <div className="mb-12">
            <Logo variant="full" color="#000000" showSlogan={true} className="mb-4" />
            <div className="w-12 h-0.5 bg-gold mx-auto mt-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Usuário / Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                placeholder="Ex: marcos.silva"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-end">
              <button 
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-[10px] font-bold text-zinc-400 hover:text-gold transition-colors uppercase tracking-widest"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-black text-white font-bold uppercase tracking-[0.25em] text-xs rounded-2xl shadow-xl hover:bg-zinc-800 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-zinc-100 text-center">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6">Autenticação Biométrica Industrial</p>
            <button
              onClick={handleBiometricClick}
              disabled={isBiometricLoading}
              className={`w-20 h-20 rounded-3xl border border-zinc-100 flex items-center justify-center mx-auto transition-all ${
                isBiometricLoading ? 'bg-gold/10 border-gold/30' : 'hover:bg-gold/5 hover:border-gold/40'
              }`}
            >
              {isBiometricLoading ? (
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 0c.883 0 1.746.076 2.583.222M12 3c-2.4 0-4.49 1.156-5.8 2.943M12 3c2.4 0 4.49 1.156 5.8 2.943m-1.283 1.612A10.003 10.003 0 0112 21m0 0c1.32 0 2.583-.222 3.753-.633M12 21c-2.4 0-4.49-1.156-5.8-2.943M12 21c2.4 0 4.49-1.156 5.8-2.943M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-zinc-400 font-medium tracking-[0.3em] uppercase">
            © Porto Brasil Cerâmica • Gestão Industrial Inteligente
          </p>
        </div>
      </div>

      {isForgotModalOpen && (
        <ForgotPasswordModal onClose={() => setIsForgotModalOpen(false)} />
      )}
    </div>
  );
};

export default Login;
