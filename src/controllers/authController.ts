import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import type { RegisterRequest, LoginRequest, JwtUserPayload } from '../types/auth';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response): Promise<void> => {
    const payload: RegisterRequest = req.body;
    try {
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        await UserModel.create(payload.username, payload.email, hashedPassword);
        sendSuccess(res, 'Registrasi berhasil!');
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            sendError(res, 'Username atau Email sudah terdaftar!', 409);
            return;
        }
        sendError(res, 'Error server.', 500);
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const payload: LoginRequest = req.body;
    try {
        const user = await UserModel.findByUsername(payload.username);

        if (!user || !(await bcrypt.compare(payload.password, user.password))) {
            sendError(res, 'Username atau password salah!', 401);
            return;
        }

        const tokenPayload: JwtUserPayload = {
            id: user.id, username: user.username, email: user.email
        };
        const token = jwt.sign(
            tokenPayload, process.env.JWT_SECRET as string, { expiresIn: '2h' }
        );
        sendSuccess(res, 'Login berhasil!', { token });
    } catch {
        sendError(res, 'Error server.', 500);
    }
};