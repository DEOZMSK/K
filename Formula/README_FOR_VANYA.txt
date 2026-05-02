# Formula — карта калькуляторов и проверка эквивалентности

Статус: рабочий черновик после подключения `mr.Kcopoc_oplata_bot` (в репозитории сейчас есть `tests/test_periods.py`).

## 1) Периоды (`periods`)
- Источник в боте:
  - `mr.Kcopoc_oplata_bot/tests/test_periods.py` → `REFERENCE_SCENARIOS`.
  - Web-реализация: `app/tools/calculators/periods.ts` → `calculatePeriods`.
- Входные поля:
  - `birthDate` (`YYYY-MM-DD`)
  - `mode` (`-10`, `±5`, `+10`)
  - `currentYear` (целое)
- Шаги расчёта:
  1. Валидация даты рождения.
  2. Формирование диапазона лет по `mode`.
  3. Расчёт `expression` и `destiny` через цифровой корень.
  4. Для каждого года: дата ДР в году (с правилом 29.02 → 01.03 в невисокосный год), `weekday`, `yearSuffix`, `main`, `background`.
  5. Сбор строк и `rangeLabel`.
- Выходные поля:
  - `valid`, `warning?`, `rangeLabel`, `rows[]`.
- TODO (спорные места):
  - Какой mapping дня недели является каноничным для бота (сейчас используется `[2,3,4,5,6,7,8]`)?
  - Маркер текущего года: в web стоит `●`, а в эталонах бота маркер может быть пустым.

## 2) Карма (`karma`)
- Источник в боте:
  - TODO: указать файл и функцию после добавления формулы в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/karma.ts` → `calculateKarma` (заглушка).
- Входные поля:
  - TODO: подтвердить состав полей у бота.
- Шаги расчёта:
  - TODO: перенести без изменений из бота.
- Выходные поля:
  - `valid`, `warning`.
- TODO (спорные места):
  - Какая формула редукции используется (обычный digital root или исключения для мастер-чисел)?

## 3) Ахамкара (`ahamkara`)
- Источник в боте:
  - TODO: указать файл/функцию в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/ahamkara.ts` → `calculateAhamkara` (заглушка).
- Входные поля:
  - TODO.
- Шаги расчёта:
  - TODO.
- Выходные поля:
  - `valid`, `warning`.
- TODO (спорные места):
  - Нужны ли промежуточные значения в ответе для объяснимости?

## 4) Дхарма (`dharma`)
- Источник в боте:
  - TODO: указать файл/функцию в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/dharma.ts` → `calculateDharma` (заглушка).
- Входные поля:
  - TODO.
- Шаги расчёта:
  - TODO.
- Выходные поля:
  - `valid`, `warning`.
- TODO (спорные места):
  - Какие диапазоны/шкалы интерпретации обязаны совпасть с ботом?

## 5) Экспрессия (`expression`)
- Источник в боте:
  - TODO: указать файл/функцию в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/expression.ts` → `calculateExpression` (заглушка).
- Входные поля:
  - TODO.
- Шаги расчёта:
  - TODO.
- Выходные поля:
  - `valid`, `warning`.
- TODO (спорные места):
  - Используется ли локаль-зависимая нормализация текста имени перед расчётом?

## 6) Вьявадана (`vyavadana`)
- Источник в боте:
  - TODO: указать файл/функцию в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/vyavadana.ts` → `calculateVyavadana` (заглушка).
- Входные поля:
  - TODO.
- Шаги расчёта:
  - TODO.
- Выходные поля:
  - `valid`, `warning`.
- TODO (спорные места):
  - Какая терминология полей должна быть 1:1 с ботом в API-ответе?

## 7) Варны (`varna`)
- Источник в боте:
  - TODO: указать файл/функцию в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/varna.ts` → `calculateVarna` (заглушка).
- Входные поля:
  - TODO.
- Шаги расчёта:
  - TODO.
- Выходные поля:
  - `valid`, `warning`.
- TODO (спорные места):
  - Финальный формат результата: одно значение, таблица или распределение по категориям?

## 8) Месяцы (`months`)
- Источник в боте:
  - TODO: указать файл/функцию в `mr.Kcopoc_oplata_bot`.
  - Web-реализация: `app/tools/calculators/months.ts` → `calculateMonths` (заглушка).
- Входные поля:
  - TODO.
- Шаги расчёта:
  - TODO.
- Выходные поля:
  - `valid`, `warning`, `headers`, `expressionRow`, `karmaRow`.
- TODO (спорные места):
  - Правила расчёта месяцев относительно даты рождения и текущего года (граница до/после дня рождения).
