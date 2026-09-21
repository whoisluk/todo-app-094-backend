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

// Validasi untuk update todo — task dan is_completed boleh dikirim bersamaan
export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction): void => {
    const { task, is_completed } = req.body;

    // Minimal salah satu harus dikirim
    if (task === undefined && is_completed === undefined) {
        res.status(400).json({ success: false, message: 'Isi minimal task atau is_completed!' });
        return;
    }

    // Jika task dikirim, harus berupa string
    if (task !== undefined && typeof task !== 'string') {
        res.status(400).json({ success: false, message: 'Task harus berupa string!' });
        return;
    }

    // Jika is_completed dikirim, harus berupa boolean
    if (is_completed !== undefined && typeof is_completed !== 'boolean') {
        res.status(400).json({ success: false, message: 'is_completed harus berupa true atau false!' });
        return;
    }

    next();
};