import { Router, Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const router = Router();

const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'PLACEHOLDER_API_KEY') {
    ai = new GoogleGenAI({ apiKey });
}

// POST /api/ai/analyze - Analyze sport text using Gemini
router.post('/analyze', async (req: Request, res: Response) => {
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
        res.json(result);
    } catch (err: any) {
        console.error('Gemini Analysis Failed:', err);
        res.json({
            sportName: '未知运动',
            value: 0,
            unit: '',
            isNewSport: false,
            confidence: 0,
        });
    }
});

// POST /api/ai/weekly-report - Generate weekly AI report
router.post('/weekly-report', async (req: Request, res: Response) => {
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

        res.json({ message: response.text || '继续加油！' });
    } catch (err: any) {
        console.error('Gemini Weekly Report Failed:', err);
        res.json({ message: '嘿，你这周的表现太棒了！继续加油哦！' });
    }
});

export default router;
