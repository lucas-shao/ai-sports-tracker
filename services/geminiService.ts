// Frontend Gemini service - now calls the backend API instead of using the SDK directly

import { analyzeText as apiAnalyzeText, generateWeeklyReport as apiGenerateWeeklyReport } from './api';

export interface AnalysisResult {
  sportName: string;
  value: number;
  unit: string;
  isNewSport: boolean;
  confidence: number;
}

export const analyzeSportText = async (text: string, existingSports: string[]): Promise<AnalysisResult> => {
  return apiAnalyzeText(text, existingSports);
};

export const generateWeeklyReport = async (stats: any): Promise<string> => {
  return apiGenerateWeeklyReport(stats);
};
