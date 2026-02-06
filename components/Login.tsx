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
      onLogin(); // Simulate API call
    }, 1000);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Industrial Visual */}
      <div className="bg-pb-black relative hidden md:flex flex-col items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565514020176-88a291d90895?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-pb-black via-transparent to-pb-black/80"></div>

        <div className="relative z-10 text-center space-y-8 max-w-lg">
          <div className="w-24 h-24 border border-pb-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-slow">
            <Logo className="w-12 h-12 text-pb-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-pb-white mb-2 tracking-tight">Porto Brasil</h1>
            <p className="text-[10px] font-bold text-ind-warn uppercase tracking-[0.3em]">Industrial Monitoring System v4.0</p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-pb-white/10">
            <div className="text-center">
              <span className="block text-2xl font-mono text-pb-white mb-1">98.4%</span>
              <span className="text-[10px] text-pb-gray uppercase tracking-widest">OEE Global</span>
            </div>
            <div className="text-center border-l border-pb-white/10">
              <span className="block text-2xl font-mono text-ind-ok mb-1">12</span>
              <span className="text-[10px] text-pb-gray uppercase tracking-widest">Células Ativas</span>
            </div>
            <div className="text-center border-l border-pb-white/10">
              <span className="block text-2xl font-mono text-ind-warn mb-1">3</span>
              <span className="text-[10px] text-pb-gray uppercase tracking-widest">Alertas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="bg-pb-offWhite flex flex-col items-center justify-center p-8 md:p-24 relative">
        <div className="w-full max-w-md space-y-12">

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-pb-black mb-2">Bem-vindo</h2>
            <p className="text-sm text-pb-gray">Entre com suas credenciais de operador.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-pb-black uppercase tracking-widest">Email Corporativo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-pb-white border border-pb-lightGray p-4 rounded text-pb-black focus:outline-none focus:border-pb-black focus:ring-1 focus:ring-pb-black transition-colors font-mono text-sm"
                placeholder="usuario@portobrasil.com.br"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-pb-black uppercase tracking-widest">Senha</label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[10px] font-bold text-pb-gray uppercase tracking-widest hover:text-pb-black transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-pb-white border border-pb-lightGray p-4 rounded text-pb-black focus:outline-none focus:border-pb-black focus:ring-1 focus:ring-pb-black transition-colors font-mono text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-pb-black text-pb-white font-bold uppercase tracking-widest text-xs rounded-md hover:bg-pb-darkGray transition-all transform active:scale-95"
            >
              Acessar Sistema
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pb-lightGray"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="px-4 bg-pb-offWhite text-pb-gray">Ou acesse com</span>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <button
              type="button"
              onClick={handleBiometricClick}
              className="flex flex-col items-center justify-center p-6 border border-pb-lightGray rounded hover:bg-pb-white hover:border-pb-black transition-all group"
            >
              {isBiometricLoading ? (
                <div className="w-8 h-8 border-2 border-pb-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-8 h-8 text-pb-gray group-hover:text-pb-black transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 0c.883 0 1.746.076 2.583.222M12 3c-2.4 0-4.49 1.156-5.8 2.943M12 3c2.4 0 4.49 1.156 5.8 2.943m-1.283 1.612A10.003 10.003 0 0112 21m0 0c1.32 0 2.583-.222 3.753-.633M12 21c-2.4 0-4.49-1.156-5.8-2.943M12 21c2.4 0 4.49-1.156 5.8-2.943M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707" />
                </svg>
              )}
              <span className="text-[10px] font-bold text-pb-gray uppercase tracking-widest group-hover:text-pb-black">Biometria</span>
            </button>
          </div>

        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-pb-gray font-medium tracking-[0.3em] uppercase">
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
