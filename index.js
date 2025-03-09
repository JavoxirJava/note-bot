try {
    console.log('🚀 => Botni ishga tushirish boshlandi...');
    
    await import('./config/db.js');
    console.log('🔌 => Bazaga ulanish muvaffaqiyatli amalga oshirildi!');

    // await import('./migrations/createTables.js');
    // console.log('💾 => Jadvallarni yaratish boshlandi...');

    await import('./cron/cron.js');
    console.log("🔔 => Eslatmalar muvaffaqiyatli rejalashtirildi!");

    await import('./config/bot.js');
    console.log('🤖 => Bot muaffaqiyatli ishga tushdi!');
} catch (error) {
    console.error('Error importing modules:', error);
}