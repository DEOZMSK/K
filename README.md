# Лендинг mr.Kcopoc

Next.js (App Router) + Tailwind CSS — лендинг с CTA в Telegram, лид-магнитом и интеграцией Google Sheets.

## Структура проекта
- `app/page.tsx` — главная страница и композиция секций.
- `app/components/CTAButton.tsx` — универсальная кнопка CTA с UTM-метками.
- `app/api/lead/route.ts` — serverless-функция для отправки лидов в Google Sheets.
- `content/site-config.ts` — шаблон контента с env-переменными.
- `public/privacy.html` — политика конфиденциальности.
- `env.example` — список переменных окружения.

## Запуск локально
```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Все данные берутся из `content/site-config.ts` и `.env.local`.

## Настройка данных
1. Скопируйте `env.example` → `.env.local` и заполните значениями.
2. При необходимости измените тексты/буллеты в `content/site-config.ts`.
3. Замените фото автора (env `NEXT_PUBLIC_AUTHOR_PHOTO`) и ссылки на Telegram.
4. В футере и политике конфиденциальности обновите email/ссылки.

### Пример env
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_TELEGRAM_LINK=https://t.me/baphbl
NEXT_PUBLIC_LEAD_WEBHOOK=https://your-domain.com/api/lead
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_ID=1AbC...
```

## Интеграция Google Sheets
1. Создайте сервисный аккаунт в Google Cloud → включите API Google Sheets.
2. Скачайте JSON-ключ и перенесите `client_email` + `private_key` в `.env.local`.
3. Поделитесь Google Sheet (пример: лист `Leads`) с адресом сервисного аккаунта.
4. В первой строке таблицы создайте заголовки: `timestamp, name, email, phone, consent, source, userAgent, referer`.
5. Задеплойте на Vercel — API route `/api/lead` будет вызываться формой лид-магнита.
6. Если хотите использовать другой webhook (например, Make/Zapier), пропишите URL в `NEXT_PUBLIC_LEAD_WEBHOOK`.

## Деплой на Vercel
1. Импортируйте репозиторий в Vercel.
2. В разделе *Environment Variables* добавьте все ключи из `.env.local`.
3. Запустите билд (`npm run build`).
4. Проверьте `/api/lead` через `curl` или форму на сайте.

## Чек-лист перед запуском
- [ ] Обновить тексты, CTA и цифры в `content/site-config.ts`.
- [ ] Подставить реальные ссылки и UTM.
- [ ] Проверить отправку формы (Google Sheets получает данные).
- [ ] Обновить `public/privacy.html` (email, дата, Telegram).

## Дополнительно
- Все внешние ссылки содержат `rel="noopener noreferrer"` и автоматические UTM.
- Макет мобильный-first, ширина контейнера ограничена `max-w-content`.
- При необходимости расширяйте секции, создавая новые компоненты в `app/components`.
- Заголовки и текстовые блоки используют современные кириллические шрифты [Unbounded](https://fonts.google.com/specimen/Unbounded) и [Onest](https://fonts.google.com/specimen/Onest). Чтобы заменить набор, откройте `app/layout.tsx` и обновите импорт из `next/font/google`, а затем при необходимости скорректируйте переменные `--font-inter`/`--font-heading` в `app/globals.css`.
