import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'User ID is required' });
            }

            // Fetch user
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (userError) throw userError;
            if (!user) return res.status(404).json({ error: 'User not found' });

            // Fetch all sports for this user
            const { data: sports, error: sportsError } = await supabase
                .from('sports')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: true });

            if (sportsError) throw sportsError;

            // Fetch all records for this user
            const { data: records, error: recordsError } = await supabase
                .from('records')
                .select('*')
                .eq('user_id', id)
                .order('timestamp', { ascending: false });

            if (recordsError) throw recordsError;

            // Assemble UserProfile shape
            const stats = (sports || []).map((sport: any) => {
                const sportRecords = (records || []).filter((r: any) => r.sport_id === sport.id);

                let bestRecord = { value: 0, unit: '', date: '' };
                let recentRecord = { value: 0, unit: '', date: '' };

                if (sportRecords.length > 0) {
                    const best = sportRecords.reduce((max: any, r: any) =>
                        Number(r.value) > Number(max.value) ? r : max, sportRecords[0]);
                    bestRecord = { value: Number(best.value), unit: best.unit, date: best.date };

                    recentRecord = {
                        value: Number(sportRecords[0].value),
                        unit: sportRecords[0].unit,
                        date: sportRecords[0].date,
                    };
                }

                return {
                    id: sport.id,
                    name: sport.name,
                    image: sport.image || '',
                    bestRecord,
                    recentRecord,
                    history: sportRecords.map((r: any) => ({
                        id: r.id,
                        sportName: sport.name,
                        value: Number(r.value),
                        unit: r.unit,
                        date: r.date,
                        timestamp: Number(r.timestamp),
                        tags: r.tags || [],
                        images: r.images || [],
                    })),
                };
            });

            const profile = {
                id: user.id,
                name: user.name,
                avatar: user.avatar || '',
                weeklyMessage: user.weekly_message || '',
                stats,
            };

            return res.json(profile);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
