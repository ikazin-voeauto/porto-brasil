
export type CellStatus = 'OPERATIONAL' | 'WARNING' | 'STOPPED' | 'MAINTENANCE';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'RESOLVED';

export interface Alert {
  id: string;
  cellId: string;
  cellName: string;
  severity: AlertSeverity;
  errorCode: string;
  message: string;
  timestamp: string;
  duration?: string;
  details: string;
}

export interface ProductionCell {
  id: string;
  name: string;
  status: CellStatus;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  currentProduct: string;
  unitsProduced: number;
  targetUnits: number;
  goodPieces: number;
  badPieces: number;
  temperature: number;
  vibration: number;
  lastFault?: string;
}

export interface ProductionHistory {
  timestamp: string;
  oee: number;
  production: number;
}

export type ViewType = 'DASHBOARD' | 'CELLS' | 'ANALYTICS' | 'ALERTS' | 'OPERATOR';
