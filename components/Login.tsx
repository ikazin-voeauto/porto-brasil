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
    if (email === 'adminportobrasil' && password === 'brasil123') {
      onLogin();
    } else {
      alert('Credenciais inválidas!');
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
        <div className="absolute inset-0 bg-gradient-to-t from-pb-black via-transparent to-pb-black/80"></div>

        <div className="relative z-10 text-center space-y-2 max-w-lg">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Logo className="w-24 h-24 text-pb-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-pb-white mb-4 tracking-tight">Porto Brasil</h1>
            <p className="text-[10px] font-bold text-ind-warn uppercase tracking-[0.3em]">Sistema de Monitoramento Industrial</p>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="bg-pb-offWhite flex flex-col items-center justify-center p-8 md:p-24 relative">
        <div className="w-full max-w-md space-y-4">

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-pb-black mb-2">Faça Login</h2>
            <p className="text-sm text-pb-gray">Entre com suas credenciais.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-pb-black uppercase tracking-widest">Login</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-pb-white border border-pb-lightGray p-4 rounded text-pb-black focus:outline-none focus:border-pb-black focus:ring-1 focus:ring-pb-black transition-colors font-mono text-sm"
                placeholder="Seu login"
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

        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-pb-gray font-medium tracking-[0.3em] uppercase">
            Gestão Industrial Inteligente - By Ikazin Automação
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
