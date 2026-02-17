export interface Record {
  id: string;
  sportName: string;
  value: number;
  unit: string;
  date: string; // ISO string
  timestamp: number;
  tags?: string[]; // e.g., 'broken_record', 'improved'
  images?: string[];
}

export interface SportStats {
  id: string;
  name: string;
  bestRecord: {
    value: number | string;
    unit: string;
    date: string;
  };
  recentRecord: {
    value: number | string;
    unit: string;
    date: string;
  };
  history: Record[];
  image: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  weeklyMessage: string;
  stats: SportStats[];
}

export enum AppScreen {
  HOME = 'HOME',
  CONFIRM = 'CONFIRM',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
}
