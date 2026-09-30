import pool from '../config/db.js';

export const TodoModel = {
    getByUserId: async (userId: number, limit: number, offset: number) => {
        const [rows] = await pool.query(
            'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
            [userId, limit, offset]
        );
        return rows;
    },

    countByUserId: async (userId: number) => {
        const [rows]: any = await pool.query(
            'SELECT COUNT(*) AS total FROM todos WHERE user_id = ?',
            [userId]
        );
        return rows[0].total as number;
    },

    getById: async (id: number, userId: number) => {
        const [rows]: any = await pool.query(
            'SELECT * FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0]; // Kembalikan 1 data, atau undefined jika tidak ditemukan
    },

    create: async (userId: number, task: string) => {
        const [result]: any = await pool.query(
            'INSERT INTO todos (user_id, task) VALUES (?, ?)',
            [userId, task]
        );
        return result.insertId;
    },

    // Update task atau status is_completed
    update: async (id: number, task: string, isCompleted: boolean, userId: number) => {
        const [result]: any = await pool.query(
            'UPDATE todos SET task = ?, is_completed = ? WHERE id = ? AND user_id = ?',
            [task, isCompleted, id, userId]
        );
        return result.affectedRows;
    },

    // Hapus todo berdasarkan id dan userId
    delete: async (id: number, userId: number) => {
        const [result]: any = await pool.query(
            'DELETE FROM todos WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    }
};