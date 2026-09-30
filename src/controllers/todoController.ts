import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel.js';
import type { CreateTodoRequest, UpdateTodoRequest, TodoResponse, TodoRow } from '../types/todo';
import type { PaginationMeta } from '../types/common';
import { sendSuccess, sendSuccessPagination, sendError } from '../utils/response';

// Ubah nilai query (string) menjadi angka bulat positif, kalau tidak valid pakai fallback
const parsePositiveInt = (value: unknown, fallback: number): number => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

// GET /api/todos — Ambil semua todo milik user (dengan pagination)
export const getTodos = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const page = parsePositiveInt(req.query.page, 1);
    const perPage = Math.min(parsePositiveInt(req.query.perPage, 10), 50);
    const offset = (page - 1) * perPage;

    try {
        const [todos, total] = await Promise.all([
            TodoModel.getByUserId(userId, perPage, offset),
            TodoModel.countByUserId(userId)
        ]);
        const data: TodoResponse[] = (todos as TodoRow[]).map(({ id, task, is_completed }) => ({
            id,
            todo: task,
            completed: Boolean(is_completed)
        }));
        const pagination: PaginationMeta = {
            page,
            perPage,
            total,
            totalPages: Math.ceil(total / perPage)
        };
        sendSuccessPagination(res, 'Berhasil!', data, pagination);
    } catch (error) {
        console.log(error);
        sendError(res, 'Gagal mengambil data.', 500);
    }
};

// GET /api/todos/:id — Ambil satu todo berdasarkan ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;          // Ambil id dari URL, contoh: /todos/14 → id = "14"
    const userId = req.user.id;
    try {
        const todo = await TodoModel.getById(Number(id), userId);

        // Jika undefined, berarti todo tidak ditemukan atau bukan milik user ini
        if (!todo) {
            sendError(res, 'Tugas tidak ditemukan!', 404);
            return;
        }

        const row = todo as TodoRow;
        const data: TodoResponse = {
            id: row.id, todo: row.task, completed: Boolean(row.is_completed)
        };
        sendSuccess(res, 'Berhasil!', data);
    } catch {
        sendError(res, 'Gagal mengambil data.', 500);
    }
};

// POST /api/todos — Tambah todo baru
export const createTodo = async (req: Request, res: Response): Promise<void> => {
    const payload: CreateTodoRequest = req.body;
    const userId = req.user.id;
    try {
        const newId = await TodoModel.create(userId, payload.task);
        const data: TodoResponse = { id: newId, todo: payload.task, completed: false };
        sendSuccess(res, 'Tugas berhasil ditambahkan!', data, 201);
    } catch {
        sendError(res, 'Gagal menambahkan tugas.', 500);
    }
};

// PUT /api/todos/:id — Update todo (ubah task atau tandai selesai)
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;             // id todo dari URL
    const payload: UpdateTodoRequest = req.body;
    const userId = req.user.id;
    try {
        const affectedRows = await TodoModel.update(
            Number(id), payload.task, payload.is_completed, userId
        );

        // Jika affectedRows = 0, berarti todo tidak ditemukan atau bukan milik user ini
        if (affectedRows === 0) {
            sendError(res, 'Tugas tidak ditemukan!', 404);
            return;
        }

        sendSuccess(res, 'Tugas berhasil diperbarui!');
    } catch {
        sendError(res, 'Gagal memperbarui tugas.', 500);
    }
};

// DELETE /api/todos/:id — Hapus todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;             // id todo dari URL
    const userId = req.user.id;
    try {
        const affectedRows = await TodoModel.delete(Number(id), userId);

        // Jika affectedRows = 0, berarti todo tidak ditemukan atau bukan milik user ini
        if (affectedRows === 0) {
            sendError(res, 'Tugas tidak ditemukan!', 404);
            return;
        }

        sendSuccess(res, 'Tugas berhasil dihapus!');
    } catch {
        sendError(res, 'Gagal menghapus tugas.', 500);
    }
};