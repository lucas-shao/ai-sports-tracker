import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../_lib';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const { sportId } = req.query;

            if (!sportId || typeof sportId !== 'string') {
                return res.status(400).json({ error: 'Sport ID is required' });
            }

            const { data, error } = await supabase
                .from('records')
                .select('*')
                .eq('sport_id', sportId)
                .order('timestamp', { ascending: false });

            if (error) throw error;
            return res.json(data || []);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
