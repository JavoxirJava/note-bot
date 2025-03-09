import { query } from '../config/db.js';

export const addUser = async (id, full_name, username) => {
    try {
        const isExists = await getUser(id);
        if (isExists) return isExists;
        const saveUser = await query(`
            INSERT INTO users (id, full_name, username)
            VALUES ($1, $2, $3)`,
            [id, full_name, username]
        );
        return saveUser.rows[0];
    } catch (err) {
        console.error('Foydalanuvchini qo`shishda xatolik:', err);
    }
    return null;
}

export const getUser = async (id) => {
    try {
        const user = await query(
            "SELECT * FROM users WHERE id = $1",
            [id]
        );
        return user.rows[0];
    } catch (err) {
        console.error('Foydalanuvchini olishda xatolik:', err);
    }
    return null;
}

export const getUsers = async () => {
    try {
        const users = await query(`
            SELECT * FROM users`
        );
        return users.rows;
    } catch (err) {
        console.error('Foydalanuvchilarni olishda xatolik:', err);
    }
    return [];
}