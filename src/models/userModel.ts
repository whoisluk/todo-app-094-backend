import pool from '../config/db.js';

export const UserModel = {
    findByUsername: async (username: string) => {
        const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

    create: async (username: string, email: string, hashedPassword: string) => {
        const [result]: any = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    }
};