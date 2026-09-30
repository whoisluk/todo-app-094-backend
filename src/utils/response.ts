import type { Response } from 'express';
import type { PaginationMeta, ResponseMeta } from '../types/common';

const createMeta = (): ResponseMeta => ({
    timestamp: new Date().toISOString()
});

export const sendSuccess = <T = unknown>(res: Response, message: string, data?: T, status = 200): void => {
    res.status(status).json({
        success: true,
        message,
        ...(data !== undefined ? { data } : {}),
        meta: createMeta()
    });
};

export const sendSuccessPagination = <T = unknown>(
    res: Response,
    message: string,
    data: T,
    pagination: PaginationMeta,
    status = 200
): void => {
    res.status(status).json({
        success: true,
        message,
        data,
        meta: { ...createMeta(), pagination }
    });
};

export const sendError = (res: Response, message: string, status = 500): void => {
    res.status(status).json({ success: false, message, meta: createMeta() });
};