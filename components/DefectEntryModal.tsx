import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface DefectEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (type: 'PRODUCT' | 'MACHINE', value: number | string) => void;
    cellName: string;
}

const DefectEntryModal: React.FC<DefectEntryModalProps> = ({ isOpen, onClose, onConfirm, cellName }) => {
    const [activeTab, setActiveTab] = React.useState<'PRODUCT' | 'MACHINE'>('PRODUCT');

    // Reset tab when modal opens
    React.useEffect(() => {
        if (isOpen) setActiveTab('PRODUCT');
    }, [isOpen]);

    if (!isOpen) return null;

    const quickAmounts = [1, 2, 5, 10];
    const failureTypes = [
        { id: 'MECANICA', label: 'Mecânica' },
        { id: 'ELETRICA', label: 'Elétrica' },
        { id: 'SENSOR', label: 'Sensor' },
        { id: 'OUTROS', label: 'Outros' },
    ];

    return (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <Card className="w-full max-w-md bg-pb-darkGray border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Reportar Ocorrência</h2>
                    <p className="text-pb-gray text-sm">Célula: <span className="text-white font-mono font-bold">{cellName}</span></p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-[#111] rounded-lg mb-6 border border-white/5">
                    <button
                        onClick={() => setActiveTab('PRODUCT')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'PRODUCT' ? 'bg-pb-darkGray text-white shadow-sm border border-white/10' : 'text-pb-gray hover:text-white'}`}
                    >
                        REFUGO
                    </button>
                    <button
                        onClick={() => setActiveTab('MACHINE')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'MACHINE' ? 'bg-pb-darkGray text-white shadow-sm border border-white/10' : 'text-pb-gray hover:text-white'}`}
                    >
                        MÁQUINA
                    </button>
                </div>

                {activeTab === 'PRODUCT' ? (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {quickAmounts.map(amount => (
                            <button
                                key={amount}
                                onClick={() => onConfirm('PRODUCT', amount)}
                                className="h-20 rounded-xl bg-[#111] border border-white/10 hover:border-ind-error hover:bg-ind-error/10 hover:text-ind-error transition-all group flex flex-col items-center justify-center gap-1"
                            >
                                <span className="text-3xl font-bold text-white group-hover:text-ind-error font-mono">{amount}</span>
                                <span className="text-[10px] uppercase font-bold text-pb-gray tracking-widest">Peças</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {failureTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => onConfirm('MACHINE', type.label)}
                                className="h-20 rounded-xl bg-[#111] border border-white/10 hover:border-ind-warn hover:bg-ind-warn/10 hover:text-ind-warn transition-all group flex flex-col items-center justify-center gap-1"
                            >
                                <span className="text-xl font-bold text-white group-hover:text-ind-warn uppercase">{type.label}</span>
                                <span className="text-[10px] uppercase font-bold text-pb-gray tracking-widest">Falha</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-4">
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="flex-1 border border-white/10 hover:bg-white/5"
                    >
                        CANCELAR
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default DefectEntryModal;
