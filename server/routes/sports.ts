import { Router, Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// GET /api/users/:userId/sports - Get all sports for a user
router.get('/users/:userId/sports', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { data, error } = await supabase
            .from('sports')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data || []);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/users/:userId/sports - Create a new sport category
router.post('/users/:userId/sports', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { name, image } = req.body;

        if (!name) return res.status(400).json({ error: 'Sport name is required' });

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
        res.status(201).json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
