# Note Bot

Bu bot foydalanuvchilarga eslatmalar yaratish, yangilash, o'chirish va belgilangan vaqtda xabar yuborish imkonini beradi.

## O'rnatish

### 1. Reponi klonlash
```sh
git clone <repo_url>
cd note-bot
```

### 2. Zaruriy kutubxonalarni o'rnatish
```sh
npm install
```

### 3. Muhit o'zgaruvchilarini sozlash
Fayl nomini `example.env` dan `.env` ga o'zgartiring va kerakli qiymatlarni to'ldiring:
```sh
mv example.env .env
```
`.env` fayliga quyidagi ma'lumotlarni kiriting:
```
BOT_TOKEN=<your_bot_token>
DB_NAME=<your_bot_db_name>
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_HOST=<your_db_host>
DB_PORT=<your_db_port>
```

## Ishga tushirish

```sh
node index.js
```

## Ishlash prinsipi
- Bot foydalanuvchilardan eslatmalarni qabul qiladi.
- Eslatmalar belgilangan vaqtda yuboriladi.
- Eslatmalar CRUD operatsiyalari bilan boshqariladi.

## Kutubxonalar
Loyihada quyidagi asosiy kutubxonalar ishlatilgan:
- `dotenv` - Muhit o'zgaruvchilarini yuklash
- `moment` - Vaqt formatlash
- `node-cron` - Cron ishlarini bajarish
- `pg` - PostgreSQL bilan ishlash
- `telegraf` - Telegram bot yaratish uchun

## Muammolar va yechimlar
Agar dasturda xatolik yuzaga kelsa:
1. `.env` faylini to'g'ri to'ldirganingizni tekshiring.
2. Baza ma'lumotlarini kiritishda xatolik yo'qligini tekshiring.
3. `npm install` orqali barcha paketlar o'rnatilganligiga ishonch hosil qiling.

## Hissa qo'shish
Loyiha ochiq manbali va hissa qo'shishga xush kelibsiz!
```sh
git checkout -b yangi-xususiyat
```
O'zgartirishlarni kiritgandan so'ng:
```sh
git add .
git commit -m "Yangi xususiyat qo'shildi"
git push origin yangi-xususiyat
```
So'ng `Pull Request` yuboring.
