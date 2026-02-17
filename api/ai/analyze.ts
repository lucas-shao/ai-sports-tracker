import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'PLACEHOLDER_API_KEY') {
    ai = new GoogleGenAI({ apiKey });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { text, existingSports } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'text is required' });
            }

            if (!ai) {
                // Mock response when no API key
                await new Promise(r => setTimeout(r, 500));
                return res.json({
                    sportName: '颠球',
                    value: 50,
                    unit: '个',
                    isNewSport: !(existingSports || []).includes('颠球'),
                    confidence: 0.95,
                });
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `Extract the sport activity, quantity, and unit from this text: "${text}".
        Also determine if this sport is present in the existing list: ${JSON.stringify(existingSports || [])}.
        If it is not in the list, set isNewSport to true.
        Return JSON.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            sportName: { type: Type.STRING },
                            value: { type: Type.NUMBER },
                            unit: { type: Type.STRING },
                            isNewSport: { type: Type.BOOLEAN },
                            confidence: { type: Type.NUMBER },
                        },
                        required: ['sportName', 'value', 'unit', 'isNewSport'],
                    },
                },
            });

            const result = JSON.parse(response.text || '{}');
            return res.json(result);
        } catch (err: any) {
            console.error('Gemini Analysis Failed:', err);
            return res.json({
                sportName: '未知运动',
                value: 0,
                unit: '',
                isNewSport: false,
                confidence: 0,
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
