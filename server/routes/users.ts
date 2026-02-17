import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'User not found' });

        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/users/:id/profile - Get full user profile with sports + stats
router.get('/:id/profile', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

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

            // Calculate best and recent records
            let bestRecord = { value: 0, unit: '', date: '' };
            let recentRecord = { value: 0, unit: '', date: '' };

            if (sportRecords.length > 0) {
                // Best = highest value
                const best = sportRecords.reduce((max: any, r: any) =>
                    Number(r.value) > Number(max.value) ? r : max, sportRecords[0]);
                bestRecord = { value: Number(best.value), unit: best.unit, date: best.date };

                // Recent = most recent by timestamp
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

        res.json(profile);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, avatar, weeklyMessage } = req.body;

        if (!name) return res.status(400).json({ error: 'Name is required' });

        const { data, error } = await supabase
            .from('users')
            .insert({
                name,
                avatar: avatar || '',
                weekly_message: weeklyMessage || '',
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
