import dotenv from 'dotenv';
import { Telegraf, session } from 'telegraf';
import { addNotes, botStart, deleteNotes, getNoteId, getNotes, isDeleteNote, noteText, noteTime, updateNote } from './botMethods.js';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.start(ctx => botStart(ctx));

bot.on('message', async ctx => {
    const user_id = ctx.from.id;
    const text = ctx.message.caption || ctx.message.text;

    if (!ctx.session) ctx.session = {};
    ctx.session.step = ctx.session.step || "idle";

    switch (text) {
        case "➕ Eslatma qo‘shish":
            addNotes(ctx);
            break;
        case "📋 Eslatmalar ro‘yxatini ko‘rish":
            getNotes(ctx, user_id);
            break;
        case "✏️ Eslatmani tahrirlash":
            updateNote(ctx);
            break;
        case "🗑 Eslatmani o‘chirish":
            deleteNotes(ctx, user_id);
            break;
        default:
            switch (ctx.session.step) {
                case "waiting_for_note_text":
                    noteText(ctx, text);
                    break;
                case "waiting_for_note_time":
                    noteTime(ctx, text, user_id);
                    break;
                case "waiting_for_new_text":
                    noteText(ctx, text, true);
                    break;
                case "waiting_for_note_new_time":
                    noteTime(ctx, text, user_id, true);
                    break;
            }
    }
});

bot.on("callback_query", async ctx => {
    const callbackData = ctx.callbackQuery.data;
    
    if (callbackData.startsWith("edit_")) getNoteId(ctx, callbackData, true);
    else if (callbackData.startsWith("delete_")) getNoteId(ctx, callbackData);
    else if (callbackData === "confirm_delete") isDeleteNote(ctx, true);
    else if (callbackData === "cancel_delete") isDeleteNote(ctx);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export const sendMessage = async (user_id, text) => {
    await bot.telegram.sendMessage(user_id, text, { parse_mode: "Markdown" });
}

export const sendPhoto = async (user_id, photo, caption) => {
    await bot.telegram.sendPhoto(user_id, photo, { caption }, { parse_mode: "Markdown" });
}

export default bot;