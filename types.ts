export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface ReviewComment {
  snippet: string;
  issue: string;
  explanation: string;
  category: 'Language' | 'Style' | 'Structure' | 'Format' | 'Risk';
  severity: 'Minor' | 'Major' | 'Critical';
}

export interface VisualSuggestion {
  type: 'Chart' | 'Table';
  title: string;
  description: string;
  chartData?: { label: string, value: number }[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  config?: {
    chartType?: 'bar' | 'line' | 'pie';
  };
}

export interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  status: 'Pending' | 'Passed' | 'Failed';
  description: string;
}

export interface AnalysisResult {
  manuscriptText: string;
  htmlContent?: string; // Word'den gelen zengin metin görünümü için
  summary: string;
  overallScore: number;
  comments: ReviewComment[];
  checklist: ChecklistItem[];
  deskRejectionRisks: {
    risk: string;
    level: RiskLevel;
    mitigation: string;
  }[];
  visualSuggestions: VisualSuggestion[];
}
