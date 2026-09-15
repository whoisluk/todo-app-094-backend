import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'Username, email, dan password wajib diisi!' });
        return;
    }
    if (!email.includes('@')) {
        res.status(400).json({ success: false, message: 'Format email tidak valid!' });
        return;
    }
    next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
        return;
    }
    next();
};

export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
    const { task } = req.body;
    if (!task || typeof task !== 'string') {
        res.status(400).json({ success: false, message: 'Task wajib diisi dengan format string!' });
        return;
    }
    next();
};