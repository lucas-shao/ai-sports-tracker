import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

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
            const { stats, userName } = req.body;

            if (!ai) {
                return res.json({
                    message: `嘿 ${userName || 'Alex'}，你这周的表现太棒了！继续加油哦！`,
                });
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: `Generate a short, encouraging one-sentence weekly report for an athlete named ${userName || 'Alex'} based on these stats: ${JSON.stringify(stats)}. Language: Chinese.`,
            });

            return res.json({ message: response.text || '继续加油！' });
        } catch (err: any) {
            console.error('Gemini Weekly Report Failed:', err);
            return res.json({ message: '嘿，你这周的表现太棒了！继续加油哦！' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
