import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL ? '✅ SET (' + process.env.SUPABASE_URL.substring(0, 30) + '...)' : '❌ MISSING',
            SUPABASE_KEY: process.env.SUPABASE_KEY ? '✅ SET (length: ' + process.env.SUPABASE_KEY.length + ')' : '❌ MISSING',
            DEFAULT_USER_ID: process.env.DEFAULT_USER_ID || '❌ MISSING',
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ SET' : '⚠️ MISSING (optional)',
        },
        supabase: 'testing...',
    };

    try {
        const { data, error } = await supabase.from('users').select('id, name').limit(1);
        if (error) {
            diagnostics.supabase = '❌ ERROR: ' + error.message;
            diagnostics.supabaseDetails = error;
        } else {
            diagnostics.supabase = '✅ CONNECTED';
            diagnostics.usersFound = data?.length || 0;
            diagnostics.sampleUser = data?.[0] || null;
        }
    } catch (err: any) {
        diagnostics.supabase = '❌ EXCEPTION: ' + err.message;
    }

    return res.status(200).json(diagnostics);
}
