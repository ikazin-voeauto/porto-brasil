import React, { useState } from 'react';

interface SystemAccessProps {
    onUnlock: () => void;
}

const SystemAccess: React.FC<SystemAccessProps> = ({ onUnlock }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate check delay for security feeling
        setTimeout(() => {
            if (username === 'ikazin' && password === 'Acesso@2026') {
                onUnlock();
            } else {
                setError('Acesso negado. Credenciais inválidas.');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-mono">
            <div className="max-w-md w-full relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-900/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-900/20 rounded-full blur-3xl"></div>

                <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-8 rounded-xl shadow-2xl relative z-10 overflow-hidden">
                    {/* Top colored bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                    <div className="text-center mb-10 mt-2">
                        <h1 className="text-3xl font-bold text-white tracking-tighter mb-2">
                            IKAZIN<span className="text-blue-500">.DEV</span>
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">
                            Ambiente Seguro de Homologação
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Usuário do Sistema</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] text-gray-200 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm placeholder-gray-700"
                                placeholder="Identificação..."
                                autoComplete="off"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Chave de Acesso</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#111] border border-[#333] text-gray-200 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm placeholder-gray-700"
                                placeholder="Senha segura..."
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs flex items-center">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold uppercase tracking-widest text-xs rounded shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:from-blue-500 hover:to-blue-600 transition-all transform active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                </span>
                            ) : 'Liberar Acesso'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[#333] text-[10px]">TARGET SOFTWARE : PORTO BRASIL V4.0</p>
                        <p className="text-[#333] text-[10px] mt-1">Desenvolvido por Ikazin® · Engenharia e Automação</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemAccess;
