
import React, { useState } from 'react';

interface ReportFaultModalProps {
  cellName: string;
  onClose: () => void;
}

const ReportFaultModal: React.FC<ReportFaultModalProps> = ({ cellName, onClose }) => {
  const [step, setStep] = useState(1);
  const [faultType, setFaultType] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    if (step === 1 && faultType) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden animate-slideUp">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-luxury text-xl">Reportar Ocorrência</h3>
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Passo {step} de 2</span>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-xs text-zinc-500 leading-relaxed">Selecione o tipo de falha detectada na <span className="text-black font-bold">{cellName}</span>.</p>
              <div className="grid grid-cols-1 gap-3">
                {['Mecânica', 'Elétrica / Eletrônica', 'Falta de Insumo', 'Qualidade do Barro', 'Software / PLC'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFaultType(type)}
                    className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all ${
                      faultType === type ? 'border-gold bg-gold/5 text-black' : 'border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button
                disabled={!faultType}
                onClick={handleNext}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px] rounded-xl disabled:opacity-30"
              >
                Próximo Passo
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Descrição Breve</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl focus:outline-none focus:border-gold min-h-[120px] text-xs"
                  placeholder="Descreva o que está ocorrendo..."
                  required
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border border-zinc-200 text-zinc-400 font-bold uppercase tracking-widest text-[10px] rounded-xl"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-red-200"
                >
                  Confirmar Report
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="py-12 text-center animate-fadeIn">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-sm font-bold text-black uppercase tracking-widest">Ocorrência Enviada</p>
              <p className="text-[10px] text-zinc-400 mt-2 uppercase">Equipe de manutenção notificada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportFaultModal;
