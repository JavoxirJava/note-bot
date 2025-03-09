import { query } from '../config/db.js';

export const addNote = async (description, image_id, user_id, remind_at) => {
    try {
        const saveNote = await query(`
            INSERT INTO notes (description, image_id, user_id, remind_at)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [description, image_id, user_id, remind_at]
        );
        return saveNote.rows[0];
    } catch (err) {
        console.error('Note qo`shishda xatolik:', err);
    }
    return null;
}

export const getNotes = async () => {
    try {
        const notes = await query(`
            SELECT * FROM notes WHERE remind_at >= NOW()`
        );
        return notes?.rows;
    } catch (err) {
        console.error('Note larni olishda xatolik:', err);
    }
    return [];
}

export const getNoteByUser = async (user_id) => {
    try {
        const notes = await query(`
            SELECT * FROM notes WHERE user_id = $1`,
            [user_id]
        );
        return notes.rows;
    } catch (err) {
        console.error('Foydalanuvchining eslatmalarini olishda xatolik:', err);
    }
    return [];
}

export const editNote = async (id, description, image_id, user_id, remind_at) => {
    try {
        const editNote = await query(`
            UPDATE notes
            SET description = $1, image_id = $2, user_id = $3, remind_at = $4
            WHERE id = $5`,
            [description, image_id, user_id, remind_at, id]
        );
        return editNote.rows[0];
    } catch (err) {
        console.error('Note tahrirlashda xatolik:', err);
    }
    return null;
}

export const deleteNote = async (id) => {
    try {
        const deleteNote = await query(`
            DELETE FROM notes
            WHERE id = $1`,
            [id]
        );
        return deleteNote.rows[0];
    } catch (err) {
        console.error('Note o`chirishda xatolik:', err);
    }
    return null;
}