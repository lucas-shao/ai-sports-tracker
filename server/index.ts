import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import sportsRouter from './routes/sports.js';
import recordsRouter from './routes/records.js';
import aiRouter from './routes/ai.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/users', usersRouter);
app.use('/api', sportsRouter);
app.use('/api', recordsRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In production, serve the frontend build
if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;
