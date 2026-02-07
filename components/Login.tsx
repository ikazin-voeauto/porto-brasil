import React, { useState } from 'react';
import ForgotPasswordModal from './ForgotPasswordModal';
import Logo from './Logo';

import oeeImage from '../assets/oee_completo.svg';

interface LoginProps {
  onLogin: () => void;
}

// Credenciais válidas (mesmo schema: usuário + senha)
const CREDENTIALS = [
  { usuario: 'marciovieira', senha: 'portobrasil123@' },
  { usuario: 'victorvillalva', senha: 'portobrasil123@' },
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = CREDENTIALS.some(
      (c) => c.usuario === usuario.trim().toLowerCase() && c.senha === password
    );
    if (valid) {
      onLogin();
    } else {
      alert('Credenciais inválidas!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pb-darkGray relative overflow-hidden">

      {/* Right Side Watermark Logo */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-5">
        <Logo variant="responsive" className="h-[120vh] w-[120vh] text-pb-white" />
      </div>

      {/* Login Form Container */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="w-full space-y-8">

          <div className="text-center space-y-4">
            <img
              src={oeeImage}
              alt="OEE - Overall Equipment Effectiveness"
              className="h-16 w-auto mx-auto object-contain"
            />
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-white tracking-[0.1em] uppercase">PORTO BRASIL</h2>
              <p className="text-xs text-pb-white tracking-widest uppercase">Acesso ao Sistema de Monitoramento</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <div className="space-y-6">
              {/* Login Input - Minimalist Line Style */}
              <div className="group relative">
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="peer w-full bg-transparent border-b border-[#333333] py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300 font-mono text-sm pt-5"
                  placeholder="Seu login"
                  id="login_field"
                />
                <label
                  htmlFor="login_field"
                  className="absolute left-0 top-1 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Usuário
                </label>
              </div>

              {/* Password Input - Minimalist Line Style */}
              <div className="group relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer w-full bg-transparent border-b border-[#333333] py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300 font-mono text-sm pt-5"
                  placeholder="Sua senha"
                  id="password_field"
                />
                <label
                  htmlFor="password_field"
                  className="absolute left-0 top-1 text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-white"
                >
                  Senha
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#DADADA] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Acessar Painel
            </button>
          </form>

        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-[10px] text-white/100 tracking-[0.2em] uppercase font-light hover:text-white transition-colors cursor-default">
            Propriedade da Porto Brasil
          </p>
          <div className="w-8 h-px bg-white/10 mx-auto"></div>
          <p className="text-[9px] text-white font-mono uppercase tracking-[0.3em] hover:text-[#6B6B6B] transition-colors cursor-default">
            Dev by Ikazin Automação
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
