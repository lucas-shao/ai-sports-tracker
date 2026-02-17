import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { sportId, userId, value, unit, date, timestamp, tags, images } = req.body;

            if (!sportId || !userId || value === undefined || !unit) {
                return res.status(400).json({ error: 'sportId, userId, value, and unit are required' });
            }

            const { data, error } = await supabase
                .from('records')
                .insert({
                    sport_id: sportId,
                    user_id: userId,
                    value: Number(value),
                    unit,
                    date: date || new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    timestamp: timestamp || Date.now(),
                    tags: tags || [],
                    images: images || [],
                })
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
