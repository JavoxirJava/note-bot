import { sendMessage, sendPhoto } from "../config/bot.js";
import { deleteNote, getNotes } from "../modules/noteModule.js";

// Barcha eslatmalar uchun cronlarni saqlash
const scheduledJobs = new Map();

export async function scheduleReminders() {
    try {
        const notes = await getNotes();

        for (let note of notes) {
            const { id, description, image_id, user_id, remind_at } = note;

            if (scheduledJobs.has(id)) continue; // Cron allaqachon yaratilib bo'lgan bo‘lsa, o'tkazib yuboramiz

            const remindTime = new Date(remind_at);
            const now = new Date();
            const delay = remindTime - now;

            if (delay > 0) {
                const job = setTimeout(async () => {
                    console.log(`Eslatma yuborilmoqda: ${description}`);
                    
                    let message = `⏰ *Eslatma:* ${description}`;

                    if (image_id) await sendPhoto(user_id, image_id, message);
                    else await sendMessage(user_id, message);

                    // Eslatma yuborilgandan keyin o‘chiramiz
                    await deleteNote(id);

                    scheduledJobs.delete(id); // Cronni ro‘yxatdan o‘chiramiz
                }, delay);

                scheduledJobs.set(id, job); // Cronni saqlaymiz
            }
        }
    } catch (error) {
        console.error("Xatolik eslatmalarni rejalashtirishda:", error);
    }
}

// Bot ishga tushganda hamma eslatmalarni yuklaymiz
scheduleReminders();