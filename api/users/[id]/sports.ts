import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../_lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('sports')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return res.json(data || []);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, image } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Sport name is required' });
            }

            const { data, error } = await supabase
                .from('sports')
                .insert({
                    user_id: userId,
                    name,
                    image: image || '',
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
