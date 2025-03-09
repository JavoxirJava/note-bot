import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const db = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

(async () => {
    try {
        await db.connect();
    } catch (err) {
        console.error('Ulanishda xato:', err);
        process.exit(1);
    }
})();

export const query = async (query, params = []) => {
    try {
        const result = await db.query(query, params);
        return result;
    } catch (err) {
        console.error('Error executing query:', err);
    }
}

process.on('exit', () => {
    db.end();
});

export default db;