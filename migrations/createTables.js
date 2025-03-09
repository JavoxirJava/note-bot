import db from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {    
    try {
        await db.query(`
            -- Jadvallarni o'chirish
            DROP SCHEMA public CASCADE; CREATE SCHEMA public;

            -- Jadvallarni yaratish
            CREATE TABLE users (
                id BIGINT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                username VARCHAR(255) UNIQUE
            );

            CREATE TABLE notes (
                id SERIAL PRIMARY KEY,
                description TEXT NOT NULL,
                image_id TEXT,
                user_id BIGINT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
                remind_at TIMESTAMP NOT NULL
            );

            -- Indekslar
            CREATE INDEX idx_notes_user_id ON notes(user_id);
            CREATE INDEX idx_notes_remind_at ON notes(remind_at);
        `);
    } catch (err) {
        console.error('Jadvallarni yaratishda xatolik:', err);
    }
})();