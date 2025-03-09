import { Markup } from "telegraf";
import { addUser } from "../modules/userModule.js";
import { addNote, deleteNote, editNote, getNoteByUser } from "../modules/noteModule.js";
import moment from "moment";
import { scheduleReminders } from "../cron/cron.js";

export const botStart = ctx => {
    ctx.reply(
        "👋 Assalomu alaykum! Ushbu bot yordamida eslatmalar yaratishingiz va ularni boshqarishingiz mumkin. 📌\n\n" +
        "📌 *Mavjud funksiyalar:*\n" +
        "- ➕ *Eslatma qo‘shish*\n" +
        "- 📋 *Eslatmalar ro‘yxatini ko‘rish*\n" +
        "- ✏️ *Eslatmani tahrirlash*\n" +
        "- 🗑 *Eslatmani o‘chirish*\n" +
        "- ⏰ *Kelayotgan eslatmalarni tekshirish*\n\n" +
        "Quyidagi tugmalardan birini tanlang! 👇",
        {
            parse_mode: "Markdown",
            ...Markup.keyboard([
                ["➕ Eslatma qo‘shish"],
                ["📋 Eslatmalar ro‘yxatini ko‘rish"],
                ["✏️ Eslatmani tahrirlash"],
                ["🗑 Eslatmani o‘chirish"],
            ]).oneTime().resize(),
        }
    );
    addUser(ctx.from.id, ctx.from.first_name, ctx.from.username);
}

export const addNotes = ctx => {
    ctx.reply(
        "✍️ Eslatma matnini kiriting:\n\n" +
        "📅 So‘ngra vaqtni (YYYY-MM-DD HH:MM) formatida yuboring.\n\n" +
        "🖼 Agar rasm qo‘shmoqchi bo‘lsangiz, matn bilan birga yuboring!"
    );
    ctx.session.step = "waiting_for_note_text";
    scheduleReminders();
}

export const getNotes = async (ctx, user_id) => {
    ctx.reply("📋 Sizning eslatmalar ro‘yxatingiz:");
    const notes = await getNoteByUser(user_id);
    if (!notes.length)
        return ctx.reply("🔍 Sizda hech qanday eslatma mavjud emas.");

    let message = "📋 *Sizning eslatmalaringiz:*\n\n";

    notes.forEach((note, index) => {
        const formattedDate = new Date(note.remind_at).toLocaleString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        message += `📌 *${index + 1}.* ${note.description}\n`;
        message += `📅 *Vaqt:* ${formattedDate}\n`;
        if (note.image_id) message += `🖼 *Rasm bor*\n`;
        message += `----------------------\n`;
    });

    await ctx.reply(message, { parse_mode: "Markdown" });

    // Agar rasmli eslatmalar bo‘lsa, ularni ham jo‘natamiz
    for (let note of notes)
        if (note.image_id) {
            const formattedDate = new Date(note.remind_at).toLocaleString("uz-UZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
            await ctx.replyWithPhoto(note.image_id, { caption: `📌 ${note.description}\n📅 ${formattedDate}` });
        }
}

export const updateNote = async ctx => {
    const userId = ctx.from.id;
    const noteList = await getNoteByUser(userId);

    if (!noteList.length) return ctx.reply("🔍 Sizda hech qanday eslatma mavjud emas.");

    // Inline tugmalar orqali eslatmalar ro‘yxatini chiqarish
    const buttons = noteList.map((note) => [
        { text: note.description, callback_data: `edit_${note.id}` }
    ]);

    ctx.reply("✏️ Qaysi eslatmani tahrirlashni xohlaysiz?", {
        reply_markup: { inline_keyboard: buttons }
    });

    scheduleReminders();
}

export const deleteNotes = async (ctx, userId) => {
    const notes = await getNoteByUser(userId);

    if (!notes.length)
        return ctx.reply("🔍 Sizda hech qanday eslatma mavjud emas.");

    const buttons = notes.map((note) => [
        { text: note.description, callback_data: `delete_${note.id}` }
    ]);

    ctx.reply("🗑 Qaysi eslatmani o‘chirmoqchisiz?", {
        reply_markup: { inline_keyboard: buttons }
    });
    scheduleReminders();
}

export const noteText = (ctx, text, isEdit = false) => {
    const imageId = ctx.message.photo ? ctx.message.photo[ctx.message.photo.length - 1].file_id : null;

    if (!text) return ctx.reply("❌ Iltimos, eslatma matnini kiriting!");

    ctx.session.noteText = text;
    ctx.session.noteImage = imageId;

    if (isEdit) {
        ctx.session.step = "waiting_for_note_new_time";
        ctx.reply("📅 *Endi yangi vaqtni kiriting (YYYY-MM-DD HH:MM):*", { parse_mode: "Markdown" });
    } else {
        ctx.session.step = "waiting_for_note_time";
        ctx.reply("📅 *Endi eslatma vaqtini (YYYY-MM-DD HH:MM) formatida yuboring:*", { parse_mode: "Markdown" });
    }
}

export const noteTime = async (ctx, timeText, userId, isEdit = false) => {

    if (!moment(timeText, "YYYY-MM-DD HH:mm", true).isValid())
        return ctx.reply("❌ Noto‘g‘ri format!\n📌 Vaqtni *YYYY-MM-DD HH:MM* formatida kiriting.\n\nMasalan: *2025-03-09 14:30*", { parse_mode: "Markdown" });

    if (isEdit) {
        await editNote(ctx.session.noteId, ctx.session.noteText, ctx.session.noteImage, userId, timeText);
        ctx.reply("✅ *Eslatma muvaffaqiyatli yangilandi!*", { parse_mode: "Markdown" });
    } else {
        const note = await addNote(ctx.session.noteText, ctx.session.noteImage, userId, timeText);
        ctx.reply("✅ Eslatma saqlandi!");
    }
    ctx.session = null;
}

export const getNoteId = async (ctx, callbackData, isEdit = false) => {
    const noteId = callbackData.split("_")[1];
    ctx.session.noteId = noteId;

    if (isEdit) {
        await ctx.reply("📜 *Yangi matnni kiriting yoki rasm bilan birga yuboring:*", { parse_mode: "Markdown" });
        ctx.session.step = "waiting_for_new_text";
    } else await ctx.editMessageText("⚠️ *Eslatmani o‘chirishni tasdiqlaysizmi?*", {
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "✅ Ha", callback_data: "confirm_delete" }],
                [{ text: "❌ Yo‘q", callback_data: "cancel_delete" }]
            ]
        }
    });
}

export const isDeleteNote = async (ctx, isDelete = false) => {
    if (isDelete) {
        await deleteNote(ctx.session.noteId);
        ctx.editMessageText("✅ *Eslatma muvaffaqiyatli o‘chirildi!*", { parse_mode: "Markdown" });
    } else ctx.editMessageText("❌ *Eslatma o‘chirilishi bekor qilindi.*", { parse_mode: "Markdown" });
    ctx.session = null;
}