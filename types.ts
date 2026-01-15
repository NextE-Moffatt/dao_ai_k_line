export interface UserProfile {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  gender: 'male' | 'female';
  photoBase64?: string; // Optional for Physiognomy
  location?: string; // Birth place for Ba Zi precision
}

export interface KLinePoint {
  age: number;
  year: number;
  open: number; // Luck score at start of period
  close: number; // Luck score at end of period
  high: number; // Peak luck during period
  low: number; // Lowest luck during period
  summary: string; // Short text for tooltip
}

export interface AnalysisResult {
  chartData: KLinePoint[];
  overallDestiny: string; // General poem or summary
  systemBreakdown: {
    bazi: string;
    ziwei: string;
    physiognomy?: string;
    fengshuiAdvice: string;
    qimen: string;
  };
  advice: string;
}

export enum AppState {
  INPUT,
  ANALYZING,
  RESULT,
  ERROR
}