import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { randomUUID } from 'crypto';
import { sendSuccess, sendError } from './utils/response';

const app = express();

app.use(cors({ exposedHeaders: ['X-Request-Id'] }));
app.use(express.json());

// requestId per-request dikirim lewat header
app.use((req, res, next) => {
    const requestId = randomUUID();
    res.locals.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
});

// Log setiap request beserta id uniknya
app.use((req, res, next) => {
    console.log(`[${res.locals.requestId}] ${req.method} ${req.originalUrl}`);
    next();
});

// Route utama — cek apakah server berjalan
app.get('/', (req, res) => {
    sendSuccess(res, 'Backend Todo Praktikum Berjalan Mulus!');
});

// Daftarkan semua route dengan prefix /api
app.use('/api', routes);

// 404 Handler — dipanggil jika tidak ada route yang cocok
app.use((req: Request, res: Response) => {
    sendError(res, `Route ${req.method} ${req.url} tidak ditemukan!`, 404);
});

// Global Error Handler — menangkap error yang tidak tertangani
// Harus ada 4 parameter (err, req, res, next) agar Express mengenalinya sebagai error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Terjadi error:', err.message);
    sendError(res, 'Terjadi kesalahan pada server.', 500);
});

export default app;