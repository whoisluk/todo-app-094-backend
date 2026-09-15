import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan!' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        res.locals.userId = decoded.id;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: 'Sesi tidak valid atau kedaluwarsa!' });
    }
};