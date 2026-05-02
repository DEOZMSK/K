# Handoff: Mini App кнопка в главном меню

## Что сделано в коде
- Добавлена кнопка `🔮 Мини‑приложение` в main menu keyboard builder.
- Для поддерживаемых клиентов используется `WebAppInfo(url=MINI_APP_URL)`.
- Добавлен fallback через обычную inline-ссылку на тот же URL.
- URL вынесен в env: `MINI_APP_URL` (по умолчанию `https://jyotishgpt.ru/tools`).

## Ручной шаг (BotFather / Menu Button)
Если нужен запуск как **Main Mini App** через кнопку меню Telegram:
1. Открыть `@BotFather` → выбрать бота.
2. `Bot Settings` → `Menu Button`.
3. Установить тип `Web App` и URL = значение `MINI_APP_URL`.
4. Проверить на iOS/Android/Desktop, что меню открывает web app.

## Smoke-check после выката
- Платёжные кнопки и flow оплаты работают без изменений.
- Drip campaign триггеры и текущие кнопки не изменены.
- Новая кнопка открывает `/tools` как web app; при неподдержке — как обычная ссылка.
