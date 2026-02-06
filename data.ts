
import { ProductionCell, ProductionHistory, Alert } from './types';

export const MOCK_CELLS: ProductionCell[] = Array.from({ length: 20 }, (_, i) => {
  const oee = 75 + Math.random() * 20;
  const status: any = ['OPERATIONAL', 'OPERATIONAL', 'OPERATIONAL', 'WARNING', 'STOPPED'][Math.floor(Math.random() * 5)];
  const unitsProduced = Math.floor(Math.random() * 500) + 800;
  const quality = 98 + Math.random() * 1.5;
  const goodPieces = Math.floor(unitsProduced * (quality / 100));
  
  return {
    id: `C${(i + 1).toString().padStart(2, '0')}`,
    name: `Célula ${(i + 1).toString().padStart(2, '0')}`,
    status,
    oee: parseFloat(oee.toFixed(1)),
    availability: parseFloat((oee + (Math.random() * 5)).toFixed(1)),
    performance: parseFloat((oee + (Math.random() * 3)).toFixed(1)),
    quality: parseFloat(quality.toFixed(1)),
    currentProduct: ['Prato Raso Lyon', 'Xícara Windsor', 'Bowl Mediterrâneo', 'Sousplat Roma'][Math.floor(Math.random() * 4)],
    unitsProduced,
    goodPieces,
    badPieces: unitsProduced - goodPieces,
    targetUnits: 1500,
    temperature: 1150 + Math.random() * 100,
    vibration: 0.12 + Math.random() * 0.05,
    lastFault: status === 'STOPPED' ? 'Falha no sensor térmico' : undefined
  };
});

export const MOCK_HISTORY: ProductionHistory[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${i}:00`,
  oee: 80 + Math.random() * 15,
  production: 200 + Math.random() * 50
}));

export const MOCK_DAILY_HISTORY = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const oee = 78 + Math.random() * 18;
  return {
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    fullDate: date.toLocaleDateString('pt-BR'),
    oee: parseFloat(oee.toFixed(1)),
    availability: parseFloat((oee + Math.random() * 4).toFixed(1)),
    performance: parseFloat((oee + Math.random() * 2).toFixed(1)),
    quality: parseFloat((97 + Math.random() * 3).toFixed(1)),
    downtime: Math.floor(Math.random() * 120),
    cycleTime: parseFloat((40 + Math.random() * 5).toFixed(1)),
    production: Math.floor(25000 + Math.random() * 5000)
  };
});

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'AL-101',
    cellId: 'C04',
    cellName: 'Célula 04',
    severity: 'CRITICAL',
    errorCode: 'E-402',
    message: 'Superaquecimento Crítico no Forno',
    timestamp: '14:22:10',
    duration: '12min',
    details: 'Sensor térmico atingiu 1320°C (limite 1250°C). Resfriamento forçado ativado.'
  },
  {
    id: 'AL-102',
    cellId: 'C08',
    cellName: 'Célula 08',
    severity: 'WARNING',
    errorCode: 'W-015',
    message: 'Vibração Axial Acima do Normal',
    timestamp: '14:15:45',
    duration: '22min',
    details: 'Vibração detectada no motor principal (0.18 mm/s). Sugerida inspeção de correia.'
  },
  {
    id: 'AL-103',
    cellId: 'C12',
    cellName: 'Célula 12',
    severity: 'INFO',
    errorCode: 'M-102',
    message: 'Troca de Insumo Próxima',
    timestamp: '14:02:00',
    details: 'Nível de barro em 15%. Previsão de esgotamento em 45 minutos.'
  },
  {
    id: 'AL-104',
    cellId: 'C01',
    cellName: 'Célula 01',
    severity: 'CRITICAL',
    errorCode: 'E-088',
    message: 'Falha de Comunicação PLC',
    timestamp: '13:55:12',
    duration: '39min',
    details: 'Perda de pacotes via Node-RED. Verifique cabo de rede ou switch da Ala C.'
  },
  {
    id: 'AL-105',
    cellId: 'C19',
    cellName: 'Célula 19',
    severity: 'WARNING',
    errorCode: 'W-099',
    message: 'Performance Degradada',
    timestamp: '13:40:30',
    duration: '1h 5m',
    details: 'Tempo de ciclo subiu para 52s (meta 42s). Possível falha no vácuo da ventosa.'
  }
];

export const MOCK_HEATMAP_DATA = MOCK_CELLS.map(cell => ({
  id: cell.id,
  faultFrequency: Math.floor(Math.random() * 10), // 0 to 9 faults in last 24h
  activeCritical: cell.status === 'STOPPED'
}));
