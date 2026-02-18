// Frontend API service - calls the backend Express APIs

const API_BASE = '/api';

export interface AnalysisResult {
    sportName: string;
    value: number;
    unit: string;
    isNewSport: boolean;
    confidence: number;
}

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    weeklyMessage: string;
    stats: SportStats[];
}

export interface SportStats {
    id: string;
    name: string;
    image: string;
    bestRecord: { value: number | string; unit: string; date: string };
    recentRecord: { value: number | string; unit: string; date: string };
    history: RecordItem[];
}

export interface RecordItem {
    id: string;
    sportName: string;
    value: number;
    unit: string;
    date: string;
    timestamp: number;
    tags?: string[];
    images?: string[];
}

// --- User APIs ---

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/users/${userId}/profile`);
    if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try { const body = await res.json(); errMsg = body.error || JSON.stringify(body); } catch { }
        throw new Error(`Failed to fetch user profile: ${errMsg}`);
    }
    return res.json();
}

export async function createUser(name: string, avatar?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar }),
    });
    if (!res.ok) throw new Error(`Failed to create user: ${res.statusText}`);
    return res.json();
}

// --- Sport APIs ---

export async function fetchUserSports(userId: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/sports`);
    if (!res.ok) throw new Error(`Failed to fetch sports: ${res.statusText}`);
    return res.json();
}

export async function createSport(userId: string, name: string, image?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/users/${userId}/sports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }),
    });
    if (!res.ok) throw new Error(`Failed to create sport: ${res.statusText}`);
    return res.json();
}

// --- Record APIs ---

export async function fetchSportRecords(sportId: string): Promise<RecordItem[]> {
    const res = await fetch(`${API_BASE}/sports/${sportId}/records`);
    if (!res.ok) throw new Error(`Failed to fetch records: ${res.statusText}`);
    return res.json();
}

export async function createRecord(data: {
    sportId: string;
    userId: string;
    value: number;
    unit: string;
    date?: string;
    timestamp?: number;
    tags?: string[];
    images?: string[];
}): Promise<any> {
    const res = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create record: ${res.statusText}`);
    return res.json();
}

// --- AI APIs ---

export async function analyzeText(text: string, existingSports: string[]): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, existingSports }),
    });
    if (!res.ok) throw new Error(`Failed to analyze text: ${res.statusText}`);
    return res.json();
}

export async function generateWeeklyReport(stats: any, userName?: string): Promise<string> {
    const res = await fetch(`${API_BASE}/ai/weekly-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, userName }),
    });
    if (!res.ok) throw new Error(`Failed to generate report: ${res.statusText}`);
    const data = await res.json();
    return data.message;
}
