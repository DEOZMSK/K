import asyncio
import contextlib
import logging
import re
import calendar
import random
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Sequence
from zoneinfo import ZoneInfo

from about_texts import ABOUT_ME_TEXT
from drip_campaign import DripCampaign, DripStorage, VideoLibrary
from analytics import (
    init_events_db,
    log_event,
    get_event_stats,
    get_event_stats_for_period,
    was_daily_report_sent,
    mark_daily_report_sent,
)

from aiogram import Bot, Dispatcher, F, Router
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message, CallbackQuery, KeyboardButton, ReplyKeyboardMarkup,
    InlineKeyboardMarkup, InlineKeyboardButton, LabeledPrice, PreCheckoutQuery,
    BotCommand, FSInputFile, LinkPreviewOptions,
)
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.context import FSMContext
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramBadRequest

# =======================
# НАСТРОЙКИ
# =======================
import os

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
PROVIDER_TOKEN = os.getenv("PROVIDER_TOKEN")
SHOP_ID = os.getenv("SHOP_ID")          # ЮKassa shopId
SECRET_KEY = os.getenv("SECRET_KEY")    # ЮKassa secretKey

CURRENCY = "RUB"

ADMIN_ID = 5948629306
ADMIN_USERNAME = "BAPHbl"
ADMIN_CHAT_ID = 5948629306

ASTROLOGER_NAME = "Артемий Ксорос"
TIMEZONE = "Europe/Moscow"
MOSCOW_TZ = ZoneInfo(TIMEZONE)
REPORT_CHECK_INTERVAL_SECONDS = 10 * 60

CONTACT_TME = "https://t.me/JyotishGPT?src=bot"
CONTACT_EMAIL = "art.ksoros@gmail.com"

REFUND_POLICY = "Если консультация вас разочаровала — верну оплату без споров в течение 24 часов после сессии."
PDN_CONSENT = "Оформляя заказ, вы даёте согласие на обработку персональных данных (только для связи и оказания услуги)."

# =======================
# УСЛУГИ
# =======================
@dataclass
class Service:
    sid: str
    title: str
    desc: str
    duration: str
    price_rub: int
    @property
    def price_kopecks(self) -> int:
        return self.price_rub * 100

SERVICES: List[Service] = [
    Service(
        "fast_review",
        "⚡️ Обучение работе с ботом (самоанализ)",
        "30 минут, чтобы перестать метаться и спрашивать всех подряд: показываю, как использовать бота как зеркало, фиксировать состояние и получать свои ответы без паники.\nНе подойдёт, если ждёшь готовых решений, не готов работать с фактами или хочешь переложить ответственность.\nФормат для тех, кто хочет перестать зависеть от чужих мнений и понимать себя сам.",
        "30 минут",
        2500,
    ),
    Service(
        "deep_session",
        "🧠 Глубокая сессия (мой анализ вас)",
        "Когда решение уже чувствуешь, но голова не даёт выбрать — подключаю расчёты, периоды и логику, чтобы снять внутренний стоп и вернуть ясность.\nЯ делаю анализ, но не забираю твою свободу выбора: ты выходишь с картой вариантов, понимаешь риски и опоры, напряжение спадает.\nНе подойдёт, если нужен готовый ответ или хочется переложить ответственность на «астролога».\n60 минут живой работы, после которой снова можешь двигаться.",
        "60 минут",
        11500,
    ),
    Service(
        "period_route",
        "🗺 Маршрут жизненного периода (VIP)",
        "Когда цена ошибки слишком высокая, чтобы идти вслепую: строю персональную навигацию периода, показываю развилки, риски и окна возможностей, чтобы не попасть в ловушки.\nЭто не разовый разбор, а сопровождение для тех, у кого на кону бизнес, переезд, семья или крупные решения и нужна карта, а не мнение.\nНе подойдёт, если просто интересно «что там по звёздам» или хочется услышать удобный прогноз.\n120 минут работы и маршрут на период, чтобы двигаться осознанно, а не на ощупь.",
        "120 минут",
        27000,
    ),
]

SERVICE_IMAGES: Dict[str, str] = {
    "fast_review": "1.png",
    "deep_session": "3.png",
    "period_route": "5.png",
}
MAIN_SERVICE_ID = "deep_session"

# =======================
# ТЕКСТЫ
# =======================
REVIEWS = [
    "Сидел между двумя офферами\nБоялся промахнуться\nРазложили по шагам и выбрал без дрожи",
    "Застряла на решении переезда\nДумала что все сломаю\nПосле разбора стало спокойно собрала чемодан",
    "Хотела попросить повышение но стеснялась\nПрогнали варианты\nПошла говорить и получила новый оклад",
    "Боялся выглядеть незнающим на совещании\nСобрали факты и границы контроля\nВышел уверенно закрыл вопрос",
    "Запуталась в партнерах по проекту\nКаждый тянул в свою сторону\nТеперь понимаю чья зона ответственности",
    "Хотел уйти из найма в freelance\nСтрах остаться без денег давил\nПосле сессии расписал план и сделал первый контракт",
    "Не мог выбрать где жить после развода\nКазалось что любая точка опасна\nСделали карту периода я выбрал и успокоился",
    "Бросала попытки поднять чек\nСчитала что клиенты уйдут\nСейчас беру больше и не горю",
    "Складывалась в сценарий спасателя\nДумала что обязана тянуть всех\nПоставила границы и дышу",
    "Боялась открыть дело из-за ошибок прошлого\nРазобрали риски и ресурс\nЗапустила небольшой поток и держусь ровно",
    "Не решалась сказать нет семье\nСчитала что должна всем\nТеперь знаю где мой контроль и перестала ругаться",
    "Горела на работе и металась между тремя идеями\nПосле разговора оставила одну\nСил стало больше и сплю",
    "Парень предлагал вложиться в его стартап\nНе понимала как отказаться\nМы написали честный ответ и я вышла без драмы",
    "Не верила что смогу сменить город и профессию\nКрутила это год\nТеперь договорилась с руководителем и еду спокойно",
    "Боялся просить деньги за сверхурочные\nЧувствовал себя наглым\nСейчас обозначаю границы и получаю по договору",
    "Студентка с первой стажировки\nДумала что если уйдет пропадет шанс\nНашли другие окна и она ушла без паники",
    "Руководитель давил на срочные решения\nЯ застревал и молчал\nПосле консультации стал отвечать фактами и отстоял срок",
    "Боялась что снова выберу токсичного партнера\nРазложили три сигнала на старте\nНа свидания теперь хожу спокойно без роли спасателя",
    "Не понимала как говорить с инвестором\nСтрах выглядеть глупо парализовал\nСобрали короткий план и я закрыла сделку",
    "Устала от гонки за чужими ожиданиями\nНа сессии нашли мои опоры\nТеперь выбираю задачи не через страх",
    "Бизнес стоял из-за меня\nКаждый день перекладывала запуск\nРазобрались с рисками и деньги пошли в первые два дня",
]
REVIEWS_CHANNEL_MESSAGE = (
    "новые отзывы теперь публикуются в приватном канале, просто так - доступа нет, но если вы вежливо попросите @BAPHbl, открыть вам дверь🚪в https://t.me/+8s3mVGgkSA40NGQ6 ,то вы можете ознакомится с ними,спасибо!"
)
WELCOME = (
    "📜 <b>Документы бренда</b>\n"
    '<a href="https://www.jyotishgpt.ru/privacy">Политика конфиденциальности</a> • '
    '<a href="https://www.jyotishgpt.ru/user-agreement">Пользовательское соглашение</a> • '
    '<a href="https://www.jyotishgpt.ru/telegram-disclaimer">Дисклеймер Telegram</a>\n\n'
    "✨ <b>Добро пожаловать</b>\n"
    "Я Артемий Ксорос\n"
    "Это бот для бесплатного прогноза и консультаций\n"
    "Ты можешь начать с бесплатных материалов, выбери инструмент, который сейчас откликается сильнее всего.\n"
    "<b>📎 Бесплатные материалы:</b>\n"
    "1️⃣ <b>Аудит Жизни</b> — найди 3 слепые зоны, которые крадут твою энергию и деньги.\n"
    "2️⃣ <b>Экспресс-перезагрузка</b> — 4 простых шага к внутреннему спокойствию и балансу.\n"
    "3️⃣ <b>Рефрейминг</b> — научись превращать проблему в источник силы и ресурса.\n"
    "4️⃣ <b>Компас Ценностей</b> — выбери новый путь и сделай первые шаги к делу жизни.\n\n"
    "Выбирай действие на кнопках ниже"
)
FORECAST_PROMPT = "🗓 Введите дату рождения в любом удобном формате (напр.: 07.09.1994, 7.9.1994 или 07091994)."
FORECAST_AFTER = "Если откликается и хотите перейти к делу — нажмите «Оплатить сейчас» или откройте «📋 Услуги и цены»."
CONTACTS_TEXT = (
    f"📞 <b>Как связаться:</b>\n• Telegram: {CONTACT_TME}\n• Email: {CONTACT_EMAIL}\n\n"
    "📌 Других соцсетей нет — я доступен только в Telegram.\n\n"
    f"🔒 {PDN_CONSENT}\n🔁 Политика возвратов: {REFUND_POLICY}"
)

# =======================
# КЛАВИАТУРЫ
# =======================
from aiogram.types import ReplyKeyboardMarkup, InlineKeyboardMarkup, KeyboardButton, InlineKeyboardButton


def main_menu_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="Обо мне"), KeyboardButton(text="🔮 Бесплатный прогноз")],
        ],
        resize_keyboard=True,
        input_field_placeholder="Выберите пункт меню…",
    )


def about_menu_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📋 Услуги и цены")],
            [KeyboardButton(text="👍 Отзывы")],
            [KeyboardButton(text="📞 Контакты")],
            [KeyboardButton(text="⬅️ В меню")],
        ],
        resize_keyboard=True,
        input_field_placeholder="Выберите раздел…",
    )


def about_inline_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Записаться", url="https://www.jyotishgpt.ru/book")],
        ],
    )


def pay_now_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💳 Оплатить сейчас", callback_data=f"buy:{MAIN_SERVICE_ID}")],
    ])


def pdf_materials_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="📘 Аудит жизни", callback_data="pdf:audit")],
            [InlineKeyboardButton(text="⚡ Экспресс-перезагрузка", callback_data="pdf:express")],
            [InlineKeyboardButton(text="🔄 Техника «Рефрейминг»", callback_data="pdf:reframe")],
            [InlineKeyboardButton(text="🧭 Компас ценностей", callback_data="pdf:compass")],
        ]
    )


def services_kb() -> InlineKeyboardMarkup:
    rows = [[InlineKeyboardButton(text=f"{s.title} — {s.price_rub} ₽", callback_data=f"buy:{s.sid}")]
            for s in SERVICES]
    return InlineKeyboardMarkup(inline_keyboard=rows)


def forecast_calc_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="♾ Карма"),
                KeyboardButton(text="🌟 Ахамкара"),
                KeyboardButton(text="🔥 Дхарма"),
            ],
            [
                KeyboardButton(text="⚡ Экспрессия"),
                KeyboardButton(text="🚧 Вьявадана"),
                KeyboardButton(text="Варны"),
            ],
            [KeyboardButton(text="🗓 Периоды")],
            [KeyboardButton(text="ℹ️ Справка"), KeyboardButton(text="⬅️ Назад")],
        ],
        resize_keyboard=True,
    )

def periods_ranges_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="−10 лет", callback_data="periods:range:-10"),
                InlineKeyboardButton(text="+10 лет", callback_data="periods:range:+10"),
            ],
            [InlineKeyboardButton(text="±5 лет", callback_data="periods:range:±5")],
            [InlineKeyboardButton(text="📆 Месяцы", callback_data="periods:months:show")],
            [InlineKeyboardButton(text="⬅️ Назад", callback_data="periods:back")],
        ]
    )


async def send_forecast_blocks(message: Message):
    forecast_blocks = [
        {
            "title": "КАРМА",
            "emoji": "♾",
            "url": "https://t.me/JyotishGPT/52?src=bot",
            "description": "Отражает общие кармические задачи личности: те уроки, которые душа проходит в этой "
                           "жизни. Обычно связывается с числом судьбы (суммой всех чисел даты рождения) и показывает "
                           "«вектор судьбы», через какие испытания и действия идёт рост.",
        },
        {
            "title": "АХАМКАРА",
            "emoji": "🌟",
            "url": "https://t.me/JyotishGPT/98?src=bot",
            "description": "Эго, «я-чувство», структура личности. В нумерологии — это число дня рождения, "
                           "указывающее, как человек воспринимает себя и выражает волю. Можно сказать, это "
                           "«внешняя личность» или способ проявления «Я» в мире.",
        },
        {
            "title": "ДХАРМА",
            "emoji": "🔥",
            "url": "https://t.me/JyotishGPT/99?src=bot",
            "description": "Предназначение, внутренний долг, путь служения. Это духовная линия, показывающая, "
                           "как человек реализует свои дары в соответствии с природой души.",
        },
        {
            "title": "ЭКСПРЕССИЯ",
            "emoji": "⚡",
            "url": "https://teletype.in/@jyotishgpt/dharma",
            "description": "Динамика личности, то, как энергия проявляется вовне. Ведическая нумерология трактует это "
                           "как взаимодействие планетного влияния чисел — насколько человек активен, выразителен, "
                           "харизматичен.",
        },
        {
            "title": "ВЬЯВАДАНА",
            "emoji": "🚧",
            "url": "https://teletype.in/@jyotishgpt/viavadana",
            "description": "Препятствия, кармические узлы. Отражает скрытые конфликты между числами даты рождения, это "
                           "точки напряжения судьбы, где требуются осознанность и внутренний труд.",
        },
    ]

    random.shuffle(forecast_blocks)

    for idx, block in enumerate(forecast_blocks):
        preview_text = f"<a href=\"{block['url']}\">{block['emoji']} {block['title']}</a>\n{block['description']}"
        await message.answer(
            preview_text,
            reply_markup=forecast_calc_kb() if idx == 0 else None,
            parse_mode=ParseMode.HTML,
            link_preview_options=LinkPreviewOptions(is_disabled=False, show_above_text=True),
        )
        if idx < len(forecast_blocks) - 1:
            await asyncio.sleep(1)

# =======================
# FSM «бесплатный прогноз»
# =======================
class ForecastSG(StatesGroup):
    waiting_birthdate = State()
    confirming = State()
    selecting_calc = State()

# =======================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# =======================
WEEKDAY_MAP = {0: 2, 1: 9, 2: 5, 3: 3, 4: 6, 5: 8, 6: 1}
# Для дат рождения 29 февраля используем 1 марта в невисокосные годы.
LEAP_DAY_FALLBACK_MONTH = 3
LEAP_DAY_FALLBACK_DAY = 1


async def is_subscribed(bot: Bot, user_id: int) -> bool:
    try:
        member = await bot.get_chat_member("@JyotishGPT", user_id)
    except Exception:
        return False
    return member.status in {"member", "administrator", "creator"}


def sum_digits(n: int) -> int:
    return sum(int(ch) for ch in str(abs(n)))


def reduce_to_digit(n: int) -> int:
    while n > 9:
        n = sum_digits(n)
    return 9 if n == 0 else n


def weekday_to_num(value: date) -> int:
    return WEEKDAY_MAP[value.weekday()]


def calc_expression(value: date) -> int:
    return reduce_to_digit(value.day + value.month)


def calc_destiny(value: date) -> int:
    total = value.day + value.month + value.year
    return reduce_to_digit(total)


def parse_birth_date(value: Optional[str]) -> Optional[date]:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%d.%m.%Y").date()
    except Exception:
        return None


def build_rows(birth_date: date, years: Sequence[int]) -> List[Dict[str, str]]:
    if not years:
        return []

    expression_num = calc_expression(birth_date)
    destiny_num = calc_destiny(birth_date)

    rows: List[Dict[str, str]] = []

    for year in sorted(years):
        if birth_date.month == 2 and birth_date.day == 29:
            if calendar.isleap(year):
                start = date(year, 2, 29)
            else:
                start = date(year, LEAP_DAY_FALLBACK_MONTH, LEAP_DAY_FALLBACK_DAY)
        else:
            start = date(year, birth_date.month, birth_date.day)

        weekday_num = weekday_to_num(start)
        year_suffix = f"{year % 100:02d}"
        year_suffix_value = int(year_suffix)
        main_value = reduce_to_digit(weekday_num + year_suffix_value + expression_num)
        year_root = reduce_to_digit(sum_digits(year))
        background_value = reduce_to_digit(destiny_num + year_root)

        rows.append(
            {
                "year": year,
                "marker": "",
                "weekday": str(weekday_num),
                "year_suffix": year_suffix,
                "main": str(main_value),
                "background": str(background_value),
            }
        )

    return rows


def resolve_period_years(mode: str, birth_date: date) -> List[int]:
    current_year = datetime.now(ZoneInfo(TIMEZONE)).year
    if mode == "+10":
        years = list(range(current_year, current_year + 11))
    elif mode == "-10":
        years = list(range(current_year - 10, current_year + 1))
    elif mode == "±5":
        years = list(range(current_year - 5, current_year + 6))
    else:
        years = [current_year]

    filtered = [year for year in years if year >= birth_date.year]
    if not filtered:
        filtered = [birth_date.year]
    return filtered


def render_months_text(birth_date: date) -> str:
    header = [str(month) for month in range(1, 13)]

    expression_simple = calc_expression(birth_date)
    karma_simple = calc_destiny(birth_date)

    expression_row = [str(reduce_to_digit(month + expression_simple)) for month in range(1, 13)]
    karma_row = [str(reduce_to_digit(month + karma_simple)) for month in range(1, 13)]

    columns = []
    for month_idx in range(12):
        columns.append(
            [
                header[month_idx],
                expression_row[month_idx],
                karma_row[month_idx],
            ]
        )

    column_widths = [max(len(value) for value in column) for column in columns]

    lines: List[str] = []
    row_count = len(columns[0])
    for row_idx in range(row_count):
        parts = [
            columns[col_idx][row_idx].rjust(column_widths[col_idx])
            for col_idx in range(len(columns))
        ]
        lines.append("  ".join(parts))

    table = "<pre>" + "\n".join(lines) + "</pre>"
    return f"📆 Месяцы\n\n{table}"


def render_periods_text(birth_date: date, years: Sequence[int]) -> str:
    rows = build_rows(birth_date, years)
    if not rows:
        return "Периоды для выбранного диапазона не найдены."

    start_year, end_year = rows[0]["year"], rows[-1]["year"]

    columns = []
    for row in rows:
        columns.append(
            [
                f"{row['weekday']}{row['marker']}",
                row["year_suffix"],
                row["main"],
                row["background"],
            ]
        )

    if not columns:
        return "Периоды для выбранного диапазона не найдены."

    row_count = len(columns[0])
    column_widths = [
        max(len(value) for value in column)
        for column in columns
    ]

    lines: List[str] = []
    for row_idx in range(row_count):
        parts = [
            columns[col_idx][row_idx].rjust(column_widths[col_idx])
            for col_idx in range(len(columns))
        ]
        line = "  ".join(parts)
        lines.append(line)

    table = "<pre>" + "\n".join(lines) + "</pre>"
    return f"🗓 Периоды {start_year}–{end_year}\n\n{table}"


def reduce_to_single_digit(value: int) -> int:
    while value > 9:
        value = sum(int(ch) for ch in str(value))
    return value


def varna_for_digit(value: int) -> str:
    mapping = {
        1: "Кшатрий",
        9: "Кшатрий",
        3: "Брахман",
        6: "Брахман",
        2: "Вайшья",
        5: "Вайшья",
        4: "Шудра",
        7: "Шудра",
        8: "Шудра",
    }
    return mapping[value]

# =======================
# СЛОВАРИ ЗНАЧЕНИЙ (ВСТАВЬТЕ СВОИ)
# =======================
def karma_meaning(n: int) -> str:
    meanings = {
        1: '<a href="https://t.me/JyotishGPT/57?src=bot">Лидерский импульс — личная стратегия и смелые шаги</a>',
        2: '<a href="https://t.me/JyotishGPT/59?src=bot">Синергия и союзы — сила диалога и надёжных партнёров</a>',
        3: '<a href="https://t.me/JyotishGPT/61?src=bot">Творчество и коммуникация — видимость ускоряет рост</a>',
        4: '<a href="https://t.me/JyotishGPT/63?src=bot">Система и устойчивость — дисциплина даёт прорыв</a>',
        5: '<a href="https://t.me/JyotishGPT/65?src=bot">Перемены и свобода — время для экспериментов</a>',
        6: '<a href="https://t.me/JyotishGPT/67?src=bot">Ответственность и сервис — качество и забота</a>',
        7: '<a href="https://t.me/JyotishGPT/69?src=bot">Глубина и аналитика — сила ума и концентрации</a>',
        8: '<a href="https://t.me/JyotishGPT/72?src=bot">Амбиция и результат — про деньги и влияние</a>',
        9: '<a href="https://t.me/JyotishGPT/74?src=bot">Смысл и масштаб — проекты на благо других</a>',
    }
    return meanings.get(n, "Краткое значение")

def ahamkara_meaning(n: int) -> str:
    meanings = {
        1: '<a href="https://t.me/JyotishGPT/206?src=bot">Сила личности и лидерство</a>',
        2: '<a href="https://t.me/JyotishGPT/209?src=bot">Чувствительность и гармония</a>',
        3: '<a href="https://t.me/JyotishGPT/214?src=bot">Лёгкость общения и радость жизни</a>',
        4: '<a href="https://t.me/JyotishGPT/216?src=bot">Практичность и упорство</a>',
        5: '<a href="https://t.me/JyotishGPT/219?src=bot">Жажда приключений и опыта</a>',
        6: '<a href="https://t.me/JyotishGPT/221?src=bot">Любовь и умение создавать уют</a>',
        7: '<a href="https://t.me/JyotishGPT/223?src=bot">Аналитический ум и поиск знаний</a>',
        8: '<a href="https://t.me/JyotishGPT/226?src=bot">Уверенность и материальные достижения</a>',
        9: '<a href="https://t.me/JyotishGPT/228?src=bot">Сострадание и стремление к высшему</a>',
    }
    return meanings.get(n, "Краткое значение")

def dharma_meaning(n: int) -> str:
    meanings = {
        1: '<a href="https://t.me/JyotishGPT/265?src=bot">Миссия вести за собой и быть примером</a>',
        2: '<a href="https://t.me/JyotishGPT/267?src=bot">Путь посредника и создателя гармонии</a>',
        3: '<a href="https://t.me/JyotishGPT/266?src=bot">Раскрытие себя через творчество и радость</a>',
        4: '<a href="https://t.me/JyotishGPT/268?src=bot">Долг строителя и хранителя порядка</a>',
        5: '<a href="https://t.me/JyotishGPT/269?src=bot">Миссия перемен и открытия новых дорог</a>',
        6: '<a href="https://t.me/JyotishGPT/270?src=bot">Забота о близких и поддержка общества</a>',
        7: '<a href="https://t.me/JyotishGPT/271?src=bot">Учитель и исследователь глубин</a>',
        8: '<a href="https://t.me/JyotishGPT/272?src=bot">Воплощение амбиций в результат</a>',
        9: '<a href="https://t.me/JyotishGPT/273?src=bot">Служение людям и передача опыта</a>',
    }
    return meanings.get(n, "Краткое значение")

def expression_meaning(n: int) -> str:
    meanings = {
        1: '<a href="https://t.me/JyotishGPT/85?src=bot">Смелость и решительность в проявлении</a>',
        2: '<a href="https://t.me/JyotishGPT/86?src=bot">Умение слышать других и сохранять баланс</a>',
        3: '<a href="https://t.me/JyotishGPT/87?src=bot">Творческая лёгкость и радость жизни</a>',
        4: '<a href="https://t.me/JyotishGPT/88?src=bot">Стабильность и чёткая форма самовыражения</a>',
        5: '<a href="https://t.me/JyotishGPT/89?src=bot">Движение, свобода и авантюра</a>',
        6: '<a href="https://t.me/JyotishGPT/90?src=bot">Красота, забота и гармония</a>',
        7: '<a href="https://t.me/JyotishGPT/91?src=bot">Мудрость и глубина в словах</a>',
        8: '<a href="https://t.me/JyotishGPT/92?src=bot">Сила воли и масштабность замыслов</a>',
        9: '<a href="https://t.me/JyotishGPT/93?src=bot">Щедрость духа и вдохновение для других</a>',
    }
    return meanings.get(n, "Краткое значение")

def vyavadhana_meaning(n: int) -> str:
    meanings = {
        1: '<a href="https://t.me/BAPHbl">..есть ощущение? Что всё приходится делать самому. Но именно это даёт силу и уверенность. Напиши мне, расскажу как раскрыть потенциал этого числа.</a>',
        2: '<a href="https://t.me/BAPHbl">..бывает? жизнь ставит в ситуации выбора и баланса. Иногда это непросто, но именно здесь рождается внутренняя гармония. Жми и обсудим лично.</a>',
        3: '<a href="https://t.me/BAPHbl">..проверки радостью и общением? Если это число у тебя, значит Вселенная учит выражать себя свободно. Хочешь разбор — жми — пиши..</a>',
        4: '<a href="https://t.me/BAPHbl">..урок порядка и терпения? Может казаться рутиной, но именно так строится фундамент будущего. Жми и расскажу подробнее.</a>',
        5: '<a href="https://t.me/BAPHbl">..перемены и внезапные повороты? Иногда выбивают из колеи, но они же дарят свободу. Интересно, как это работает у тебя? Пиши в личку.</a>',
        6: '<a href="https://t.me/BAPHbl">..сердце, привязанности и отношения? Тут много уроков про любовь и принятие. Хочешь глубже понять этот путь? Я помогу жми на текст и срочно пиши..))</a>',
        7: '<a href="https://t.me/BAPHbl">..бывали? Проверки через одиночество и поиск смысла. Сложно? Но это время даёт сильнейший рост. Давай обсудим вместе жми на текст, пиши пока не передумал..</a>',
        8: '<a href="https://t.me/BAPHbl">..амбиций-материального..вызовы для тебя? Деньги, успех, статус — всё это часть пути. Как пройти его легче? Жми, пиши и узнаешь правила.</a>',
        9: '<a href="https://t.me/BAPHbl">..завершение и отдача..и отдача..и отдача..и отдача.?мне продолжать? Это число учит отпускать, но и даёт мудрость. Я расскажу, как превратить это в ресурс, жми на текст, пиши пока есть время.</a>',
    }
    return meanings.get(n, "Краткое значение")

# =======================
# РОУТЕРЫ
# =======================
router = Router()
drip_storage = DripStorage(Path("/data") / "drip_state.sqlite3")
drip_campaign = DripCampaign(
    storage=drip_storage,
    library=VideoLibrary(Path("/data")),
    timezone_name=TIMEZONE,
)

@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "start")
    await state.clear()
    photo_path = Path(__file__).with_name("start.jpg")
    await message.answer_photo(
        FSInputFile(photo_path),
        caption=WELCOME,
        reply_markup=main_menu_kb(),
        show_caption_above_media=True,
    )
    await message.answer(
        "📎 Бесплатные материалы:",
        reply_markup=pdf_materials_kb(),
    )
    await drip_campaign.ensure_started_for_user(message.from_user.id, datetime.now(tz=ZoneInfo("UTC")))
    drip_state = await drip_storage.get_state(message.from_user.id)
    if drip_state:
        logging.info(
            "Drip /start diagnostics: user_id=%s next_video_index=%s next_run_ts=%s",
            drip_state.user_id,
            drip_state.next_video_index,
            drip_state.next_run_at.isoformat(),
        )

@router.message(Command("reset"))
async def cmd_reset(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "reset")
    await state.clear()
    await message.answer("Начнём заново.", reply_markup=main_menu_kb())


@router.message(Command("stats"))
async def cmd_stats(message: Message):
    if message.from_user.id != ADMIN_ID:
        return
    parts = message.text.split()
    days = 1
    if len(parts) > 1:
        try:
            days = int(parts[1])
        except ValueError:
            days = 1

    unique_users, total_events, counts = await get_event_stats(days)
    period_label = "сегодня" if days == 1 else f"последние {days} дней"

    response = (
        f"📊 Статистика ({period_label})\n"
        f"- Уникальных пользователей: {unique_users}\n"
        f"- Всего событий: {total_events}\n"
        f"- /start: {counts.get('start', 0)}\n"
        f"- Обо мне: {counts.get('about_me_view', 0)}\n"
        f"- Бесплатный прогноз: {counts.get('free_forecast_start', 0)}\n"
        f"- Ввод даты: {counts.get('birthdate_input', 0)}\n"
        f"- Запись (book): {counts.get('booking_click', 0)}\n"
        f"- Успешные платежи: {counts.get('payment_success', 0)}"
    )
    await message.answer(response)

@router.message(F.text == "🔮 Бесплатный прогноз")
async def ask_birthdate(message: Message, state: FSMContext):
    if await is_subscribed(message.bot, message.from_user.id):
        await log_event(message.from_user.id, "free_forecast_start")
        await state.set_state(ForecastSG.waiting_birthdate)
        await message.answer(FORECAST_PROMPT)
        return
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Перейти в канал", url="https://t.me/JyotishGPT")],
        [InlineKeyboardButton(text="Я подписался ✅", callback_data="check_sub_forecast")],
    ])
    await message.answer(
        "Бесплатный прогноз доступен только подписчикам канала 👇",
        reply_markup=kb,
    )

@router.message(ForecastSG.waiting_birthdate, F.text)
async def confirm_birthdate(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "birthdate_input")
    text = message.text.strip()
    dt = None
    try:
        if "." in text:
            dt = datetime.strptime(text, "%d.%m.%Y")
        elif "/" in text:
            dt = datetime.strptime(text, "%d/%m/%Y")
        elif "-" in text:
            dt = datetime.strptime(text, "%d-%m-%Y")
        else:
            digits = re.sub(r"\D", "", text)
            if len(digits) == 8:
                dt = datetime.strptime(digits, "%d%m%Y")
    except Exception:
        dt = None

    if not dt:
        await message.answer("Неверный формат даты. Введите снова.")
        return

    await state.set_state(ForecastSG.confirming)
    await state.update_data(birth_date=dt.strftime("%d.%m.%Y"))

    confirm_kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Да", callback_data="forecast_yes"),
         InlineKeyboardButton(text="✏️ Изменить", callback_data="forecast_edit")],
    ])
    await message.answer(f"Вы ввели дату рождения: {dt.strftime('%d.%m.%Y')}. Всё верно?", reply_markup=confirm_kb)

@router.callback_query(F.data == "forecast_yes")
async def forecast_yes(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "birthdate_confirm_yes")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await call.message.answer("Произошла ошибка. Попробуйте ещё раз.")
        return

    await state.set_state(ForecastSG.selecting_calc)
    await call.message.edit_text("Если первый раз нажми кнопку “ℹ️ Справка”")
    await call.message.answer(
        "Выберите расчёт ниже:",
        reply_markup=forecast_calc_kb(),
    )
    await call.answer()


@router.callback_query(F.data == "forecast_edit")
async def forecast_edit(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "birthdate_confirm_edit")
    await state.set_state(ForecastSG.waiting_birthdate)
    await call.message.answer("Введите дату рождения заново, например: 07.09.1994.")


@router.callback_query(F.data == "forecast:help")
async def forecast_help(call: CallbackQuery):
    await call.answer()
    if call.message:
        await send_forecast_blocks(call.message)


@router.message(ForecastSG.selecting_calc, F.text == "ℹ️ Справка")
async def forecast_help_reply(message: Message):
    await send_forecast_blocks(message)


@router.callback_query(F.data == "forecast:karma")
async def forecast_cb_karma(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await calc_karma(call.message, state)


@router.callback_query(F.data == "forecast:ahamkara")
async def forecast_cb_ahamkara(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await calc_ahamkara(call.message, state)


@router.callback_query(F.data == "forecast:dharma")
async def forecast_cb_dharma(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await calc_dharma(call.message, state)


@router.callback_query(F.data == "forecast:expression")
async def forecast_cb_expression(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await calc_expression_view(call.message, state)


@router.callback_query(F.data == "forecast:vyavadhana")
async def forecast_cb_vyavadhana(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await calc_vyavadhana(call.message, state)


@router.callback_query(F.data == "forecast:periods")
async def forecast_cb_periods(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await show_periods_menu(call.message, state)


@router.callback_query(F.data == "forecast:back")
async def forecast_cb_back(call: CallbackQuery, state: FSMContext):
    await call.answer()
    if call.message:
        await back_to_main(call.message, state)

@router.message(ForecastSG.selecting_calc, F.text == "♾ Карма")
async def calc_karma(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "forecast_calc_karma")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer("Дата не найдена. Введите её заново через «🔮 Бесплатный прогноз».")
        return
    num = calc_destiny(birth_date)
    meaning = karma_meaning(num)
    await message.answer(f"♾ <b>Карма</b>: {num}\n{meaning}", parse_mode=ParseMode.HTML)

@router.message(ForecastSG.selecting_calc, F.text == "🌟 Ахамкара")
async def calc_ahamkara(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "forecast_calc_ahamkara")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer("Дата не найдена. Введите её заново через «🔮 Бесплатный прогноз».")
        return
    day_sum = sum(int(ch) for ch in str(birth_date.day))
    num = reduce_to_digit(day_sum)
    meaning = ahamkara_meaning(num)
    await message.answer(f"🌟 <b>Ахамкара</b>: {num}\n{meaning}", parse_mode=ParseMode.HTML)

@router.message(ForecastSG.selecting_calc, F.text == "🔥 Дхарма")
async def calc_dharma(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "forecast_calc_dharma")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer("Дата не найдена. Введите её заново через «🔮 Бесплатный прогноз».")
        return
    val = birth_date.day + birth_date.month
    num = reduce_to_digit(val)
    meaning = dharma_meaning(num)
    await message.answer(f"🔥 <b>Дхарма</b>: {num}\n{meaning}", parse_mode=ParseMode.HTML)

@router.message(ForecastSG.selecting_calc, F.text == "⚡ Экспрессия")
async def calc_expression_view(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "forecast_calc_expression")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer("Дата не найдена. Введите её заново через «🔮 Бесплатный прогноз».")
        return
    num = calc_expression(birth_date)
    meaning = expression_meaning(num)
    await message.answer(f"⚡ <b>Экспрессия</b>: {num}\n{meaning}", parse_mode=ParseMode.HTML)

@router.message(ForecastSG.selecting_calc, F.text == "🚧 Вьявадана")
async def calc_vyavadhana(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "forecast_calc_vyavadhana")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer("Дата не найдена. Введите её заново через «🔮 Бесплатный прогноз».")
        return
    if birth_date.day > 22:
        val = birth_date.day - 22
    else:
        val = 22 - birth_date.day
    num = reduce_to_digit(val)
    meaning = vyavadhana_meaning(num)
    await message.answer(f"🚧 <b>Вьявадана</b>: {num}\n{meaning}", parse_mode=ParseMode.HTML)


@router.message(ForecastSG.selecting_calc, F.text == "Варны")
async def calc_varnas(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "forecast_calc_varnas")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer("Дата не найдена. Введите её заново через «🔮 Бесплатный прогноз».")
        return

    day_sum = sum_digits(birth_date.day)
    day_digit = reduce_to_single_digit(day_sum)

    if birth_date.month >= 10:
        month_digit = reduce_to_single_digit(sum_digits(birth_date.month))
    else:
        month_digit = birth_date.month

    year_sum = sum_digits(birth_date.year)
    year_digit = reduce_to_single_digit(year_sum)

    date_digits_sum = sum(
        int(ch) for ch in f"{birth_date.day:02d}{birth_date.month:02d}{birth_date.year:04d}"
    )
    fate_digit = reduce_to_single_digit(date_digits_sum)

    steps = [
        (day_digit, 40),
        (month_digit, 10),
        (year_digit, 10),
        (fate_digit, 40),
    ]

    totals = {
        "Кшатрий": 0,
        "Брахман": 0,
        "Вайшья": 0,
        "Шудра": 0,
    }

    detail_lines = []
    for digit, percent in steps:
        varna = varna_for_digit(digit)
        totals[varna] += percent
        detail_lines.append(f"{digit} ({percent}%) {varna}")

    result_lines = [f"{birth_date.strftime('%d.%m.%Y')}:"]
    result_lines.extend(detail_lines)
    result_lines.append("")
    result_lines.append("Итого:")
    result_lines.append(f"Кшатрий — {totals['Кшатрий']}%")
    result_lines.append(f"Брахман — {totals['Брахман']}%")
    result_lines.append(f"Вайшья — {totals['Вайшья']}%")
    result_lines.append(f"Шудра — {totals['Шудра']}%")
    result_lines.append("")
    result_lines.append(
        "Проценты показывают распределение варн по дате рождения.\n"
        "Это не трактовка и не выводы о характере.\n\n"
        "Если хочешь понять, как эта конфигурация проявляется в жизни, работе и отношениях — напиши мне лично."
    )

    await message.answer("\n".join(result_lines))


@router.message(ForecastSG.selecting_calc, F.text == "🗓 Периоды")
async def show_periods_menu(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "periods_open")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        await message.answer(
            "Дата не найдена. Повторите ввод через «🔮 Бесплатный прогноз», чтобы построить периоды."
        )
        return
    await message.answer(
        'Как работать с периодами: <a href="https://teletype.in/@jyotishgpt/period">читать инструкцию</a>',
        parse_mode=ParseMode.HTML,
    )
    await state.update_data(periods_years=None)
    await message.answer(
        "Выберите диапазон, чтобы построить периоды личного года:",
        reply_markup=periods_ranges_kb(),
    )


async def _send_periods(call: CallbackQuery, state: FSMContext, mode: str):
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        if call.message:
            await call.message.answer(
                "Дата не найдена. Введите её ещё раз через «🔮 Бесплатный прогноз», и затем повторите запрос."
            )
        await call.answer()
        return

    stored_years = data.get("periods_years")

    if mode == "±5":
        years = resolve_period_years("±5", birth_date)
    else:
        shift = 10 if mode == "+10" else -10
        if stored_years:
            years = [year + shift for year in stored_years]
        else:
            years = resolve_period_years(mode, birth_date)

    years = [year for year in years if year >= birth_date.year]
    if not years:
        years = [birth_date.year]

    years = sorted(years)

    if stored_years and years == stored_years:
        await call.answer("Периоды без изменений.")
        return

    text = render_periods_text(birth_date, years)
    if call.message:
        try:
            await call.message.edit_text(text, reply_markup=periods_ranges_kb(), parse_mode=ParseMode.HTML)
        except TelegramBadRequest as exc:
            if "message is not modified" in str(exc).lower():
                await call.answer("Периоды без изменений.")
                return
            raise

    await state.update_data(periods_years=years)
    await call.answer()


@router.callback_query(F.data == "periods:months:show")
async def periods_months_show(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "periods_months_show")
    data = await state.get_data()
    birth_date = parse_birth_date(data.get("birth_date"))
    if not birth_date:
        if call.message:
            await call.message.answer(
                "Дата не найдена. Введите её ещё раз через «🔮 Бесплатный прогноз», и затем повторите запрос."
            )
        await call.answer()
        return

    text = render_months_text(birth_date)
    if call.message:
        await call.message.answer(text, parse_mode=ParseMode.HTML)
    await call.answer()


@router.callback_query(F.data == "periods:range:-10")
async def periods_range_minus_10(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "periods_range_minus10")
    await _send_periods(call, state, "-10")


@router.callback_query(F.data == "periods:range:+10")
async def periods_range_plus_10(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "periods_range_plus10")
    await _send_periods(call, state, "+10")


@router.callback_query(F.data == "periods:range:±5")
async def periods_range_pm5(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "periods_range_pm5")
    await _send_periods(call, state, "±5")


@router.callback_query(F.data == "periods:back")
async def periods_back(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "periods_back")
    await call.answer()
    if call.message:
        await call.message.edit_text("Возвращаемся к расчётам.")
        await call.message.answer(
            "Выберите расчёт ниже:",
            reply_markup=forecast_calc_kb(),
        )
    await state.update_data(periods_years=None)
@router.message(ForecastSG.selecting_calc, F.text == "⬅️ Назад")
async def back_to_main(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "menu_back_main")
    await state.clear()
    await message.answer("Вы вернулись в главное меню.", reply_markup=main_menu_kb())

@router.message(F.text == "📋 Услуги и цены")
async def show_services(message: Message):
    await log_event(message.from_user.id, "services_view")
    image_path = Path(__file__).with_name("oplata.png")
    photo = FSInputFile(image_path)
    await message.answer_photo(
        photo,
        reply_markup=services_kb(),
    )

@router.message(F.text.in_({"🧙‍♀️ Обо мне", "Обо мне"}))
async def about_me(message: Message):
    await log_event(message.from_user.id, "about_me_view")
    await log_event(message.from_user.id, "booking_click", {"source": "about"})
    photo_path = Path(__file__).with_name("Arty.jpg")
    link_preview_options = LinkPreviewOptions(is_disabled=True)

    try:
        await message.answer_photo(
            FSInputFile(photo_path),
            reply_markup=about_menu_kb(),
            link_preview_options=link_preview_options,
        )
    except TelegramBadRequest:
        logging.exception("Failed to send 'About me' photo, sending text anyway.")
        await message.answer(
            "Не удалось отправить фото, но текст ниже все равно доступен.",
            reply_markup=about_menu_kb(),
        )

    try:
        await message.answer(
            ABOUT_ME_TEXT,
            parse_mode=ParseMode.HTML,
            reply_markup=about_inline_kb(),
            link_preview_options=link_preview_options,
        )
    except TelegramBadRequest:
        await message.answer(
            "Текст временно недоступен, мы уже чиним.",
            reply_markup=about_inline_kb(),
            link_preview_options=link_preview_options,
        )

@router.message(F.text == "👍 Отзывы")
async def reviews(message: Message):
    await log_event(message.from_user.id, "reviews_view")
    await message.answer("<b>👍 Отзывы клиентов</b>")
    for r in random.sample(REVIEWS, k=3):
        await message.answer(r)
    await message.answer(REVIEWS_CHANNEL_MESSAGE)

@router.message(F.text == "📞 Контакты")
async def contacts(message: Message):
    await log_event(message.from_user.id, "contacts_view")
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✉️ Написать в Telegram", url=CONTACT_TME)],
    ])
    await message.answer(CONTACTS_TEXT, reply_markup=kb)


@router.message(F.text == "⬅️ В меню")
async def back_to_menu(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "menu_back_root")
    await state.clear()
    await message.answer("Главное меню", reply_markup=main_menu_kb())

@router.callback_query(F.data.startswith("buy:"))
async def cb_buy(call: CallbackQuery):
    sid = call.data.split(":", 1)[1]
    await log_event(call.from_user.id, "buy_click", {"service_id": sid})
    await handle_buy_request(call.message, sid)
    await call.answer()


PDF_MATERIALS = {
    "pdf:audit": "/data/Воркбук_Аудит_жизни.pdf",
    "pdf:express": "/data/Экспресс_перезагрузка.pdf",
    "pdf:reframe": "/data/Воркбук_Рефрейминг.pdf",
    "pdf:compass": "/data/Воркбук_Компас_Ценностей.pdf",
}
PDF_CAPTIONS = {
    "pdf:audit": (
        "<b>Аудит Жизни 💪</b>\n\n"
        "Держи воркбук «Аудит Жизни».\n\n"
        "Выдели 15–20 минут тишины, завари чай или кофе\n"
        "и будь максимально честен(на) с собой.\n"
        "Это не теория — это про реальные утечки энергии и денег."
    ),
    "pdf:express": (
        "<b>Экспресс-перезагрузка ⚡</b>\n\n"
        "Держи гайд «Экспресс-перезагрузка».\n\n"
        "Главный секрет — в практике.\n"
        "Прочитай сейчас, чтобы понять принцип,\n"
        "и держи под рукой, когда нужно быстро вернуть ясность."
    ),
    "pdf:reframe": (
        "<b>Рефрейминг 🔑</b>\n\n"
        "Держи воркбук «Рефрейминг».\n\n"
        "Возьми одну ситуацию, которая сейчас кажется тупиком,\n"
        "и примени главный вопрос из воркбука именно к ней.\n"
        "Часто этого достаточно, чтобы появился выход."
    ),
    "pdf:compass": (
        "<b>Компас Ценностей 🧭</b>\n\n"
        "Держи воркбук «Компас Ценностей».\n\n"
        "Выдели 15 минут тишины, чтобы никто не отвлекал.\n"
        "Главный совет — доверяй первому честному ответу.\n"
        "С правильным навигатором сложный выбор становится очевидным."
    ),
}


@router.callback_query(F.data.startswith("pdf:"))
async def cb_pdf_material(call: CallbackQuery, state: FSMContext):
    await state.update_data(pending_pdf_key=call.data)
    if not await is_subscribed(call.bot, call.from_user.id):
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="Перейти в канал", url="https://t.me/JyotishGPT")],
            [InlineKeyboardButton(text="Я подписался ✅", callback_data="check_sub")],
        ])
        if call.message:
            await call.message.answer(
                "Чтобы получить доступ к материалу, подпишись на канал 👇",
                reply_markup=kb,
            )
        await call.answer()
        return
    file_path = PDF_MATERIALS.get(call.data)
    caption = PDF_CAPTIONS.get(call.data)
    try:
        if not file_path:
            raise FileNotFoundError(f"Unknown pdf key: {call.data}")
        if not Path(file_path).is_file():
            raise FileNotFoundError(file_path)
        await call.message.answer_document(FSInputFile(file_path), caption=caption)
    except Exception:
        logging.exception("Failed to send PDF for %s", call.data)
        if call.message:
            await call.message.answer("Файл временно недоступен, попробуй позже 🙏")
    finally:
        await call.answer()

@router.callback_query(F.data == "check_sub")
async def cb_check_sub(call: CallbackQuery, state: FSMContext):
    if await is_subscribed(call.bot, call.from_user.id):
        data = await state.get_data()
        pending_key = data.get("pending_pdf_key")
        file_path = PDF_MATERIALS.get(pending_key)
        caption = PDF_CAPTIONS.get(pending_key)
        try:
            if not file_path:
                raise FileNotFoundError(f"Unknown pdf key: {pending_key}")
            if not Path(file_path).is_file():
                raise FileNotFoundError(file_path)
            if call.message:
                await call.message.answer_document(FSInputFile(file_path), caption=caption)
            await state.update_data(pending_pdf_key=None)
        except Exception:
            logging.exception("Failed to send PDF for %s", pending_key)
            if call.message:
                await call.message.answer("Файл временно недоступен, попробуй позже 🙏")
    else:
        if call.message:
            await call.message.answer(
                "Похоже, подписки ещё нет. Нажми «Перейти в канал» и возвращайся.",
                reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(text="Перейти в канал", url="https://t.me/JyotishGPT")],
                    [InlineKeyboardButton(text="Я подписался ✅", callback_data="check_sub")],
                ]),
            )
    await call.answer()

@router.callback_query(F.data == "check_sub_forecast")
async def cb_check_sub_forecast(call: CallbackQuery, state: FSMContext):
    if await is_subscribed(call.bot, call.from_user.id):
        await log_event(call.from_user.id, "free_forecast_start")
        await state.set_state(ForecastSG.waiting_birthdate)
        if call.message:
            await call.message.answer(FORECAST_PROMPT)
    else:
        if call.message:
            await call.message.answer("Подписка ещё не обнаружена. Вернись после подписки.")
    await call.answer()

# =======================
# ПЛАТЕЖИ
# =======================
def get_service_by_id(sid: str) -> Optional[Service]:
    return next((s for s in SERVICES if s.sid == sid), None)

async def handle_buy_request(message: Message, sid: str):
    service = get_service_by_id(sid)
    if not service:
        await message.answer("Услуга не найдена. Попробуйте ещё раз через меню.")
        return

    image_name = SERVICE_IMAGES.get(service.sid)
    if not image_name:
        await message.answer("Изображение услуги временно недоступно. Попробуйте позже.")
        return

    if not (PROVIDER_TOKEN or "").strip():
        await message.answer(
            "⛔️ Платёж не прошел. Решаем +-24часа\n"
            "Как только всё восстановим оплаты заработают."
        )
        return

    prices = [LabeledPrice(label=service.title, amount=service.price_kopecks)]
    invoice_link = await message.bot.create_invoice_link(
        title=service.title,
        description=f"Оплата услуги: {service.title}"[:255],
        payload=f"order:{service.sid}",
        provider_token=PROVIDER_TOKEN,
        currency=CURRENCY,
        prices=prices,
    )

    pay_kb = InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(text=f"Заплатить {service.price_rub:,} ₽".replace(",", " "), url=invoice_link)
    ]])

    image_path = Path(__file__).with_name(image_name)
    await message.answer_photo(
        photo=FSInputFile(image_path),
        caption=None,
        reply_markup=pay_kb,
    )

@router.pre_checkout_query()
async def pre_checkout(pre_checkout_q: PreCheckoutQuery, bot: Bot):
    await log_event(pre_checkout_q.from_user.id, "pre_checkout")
    await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)

@router.message(F.successful_payment)
async def successful_payment(message: Message, bot: Bot):
    await log_event(message.from_user.id, "payment_success")
    sp = message.successful_payment
    total_rub = sp.total_amount / 100
    payload = sp.invoice_payload
    sid = payload.split(":", 1)[1] if ":" in payload else "unknown"
    service = get_service_by_id(sid)
    title = service.title if service else "Услуга"
    await message.answer(
        f"✅ Спасибо! Заказ принят.\n"
        f"Оплачено: <b>{title}</b> на сумму <b>{total_rub:.2f} ₽</b>.\n"
        f"Я скоро свяжусь с вами для согласования времени."
    )
    u = message.from_user
    uname = f"@{u.username}" if u.username else f"id:{u.id}"
    await bot.send_message(
        ADMIN_CHAT_ID,
        f"💸 Успешная оплата\nПокупатель: {uname}\nУслуга: {title}\nСумма: {total_rub:.2f} ₽\nPayload: {payload}",
    )


def refresh_menu_keyboard() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="🔁 Обновить меню")]],
        resize_keyboard=True,
        input_field_placeholder="Нажмите «Обновить меню»",
    )


REFRESH_PROMPT = (
    "⚠️ Похоже, меню обновилось после последнего обновления бота.\n"
    "Нажмите кнопку ниже, чтобы всё заработало снова 👇"
)


@router.message(F.text == "🔁 Обновить меню")
async def refresh_menu(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "refresh_menu")
    await cmd_start(message, state)


@router.callback_query()
async def handle_unknown_callback(call: CallbackQuery, state: FSMContext):
    await log_event(call.from_user.id, "unknown_callback")
    await state.clear()
    if call.message:
        await call.message.answer(REFRESH_PROMPT, reply_markup=refresh_menu_keyboard())
    await call.answer()


@router.message()
async def handle_unknown_message(message: Message, state: FSMContext):
    await log_event(message.from_user.id, "unknown_message")
    await state.clear()
    await message.answer(REFRESH_PROMPT, reply_markup=refresh_menu_keyboard())


async def send_daily_report_if_needed(bot: Bot) -> None:
    now = datetime.now(MOSCOW_TZ)
    window_start = time(hour=0, minute=5)
    window_end = time(hour=1, minute=0)
    if not (window_start <= now.time() <= window_end):
        return
    report_date = now.date() - timedelta(days=1)
    report_key = report_date.isoformat()
    if await was_daily_report_sent(report_key):
        return

    start_dt = datetime.combine(report_date, time.min, tzinfo=MOSCOW_TZ)
    end_dt = start_dt + timedelta(days=1)
    unique_users, total_events, counts = await get_event_stats_for_period(start_dt, end_dt)
    if total_events == 0 or unique_users == 0:
        await mark_daily_report_sent(report_key)
        return

    report_text = (
        f"📊 Статистика за вчера ({report_date.strftime('%d.%m.%Y')})\n\n"
        f"- Уникальных пользователей: {unique_users}\n"
        f"- Всего событий: {total_events}\n"
        f"- /start: {counts.get('start', 0)}\n"
        f"- Обо мне: {counts.get('about_me_view', 0)}\n"
        f"- Бесплатный прогноз: {counts.get('free_forecast_start', 0)}\n"
        f"- Ввод даты: {counts.get('birthdate_input', 0)}\n"
        f"- Запись (book): {counts.get('booking_click', 0)}\n"
        f"- Успешные платежи: {counts.get('payment_success', 0)}"
    )

    await bot.send_message(ADMIN_ID, report_text)
    await mark_daily_report_sent(report_key)


async def daily_report_loop(bot: Bot) -> None:
    while True:
        try:
            await send_daily_report_if_needed(bot)
        except Exception:
            logging.exception("Failed to send daily report")
        await asyncio.sleep(REPORT_CHECK_INTERVAL_SECONDS)

# =======================
# MAIN
# =======================
async def on_startup(bot: Bot):
    await bot.set_my_commands([
        BotCommand(command="start", description="Запуск бота / меню"),
        BotCommand(command="reset", description="Сбросить состояние"),
    ])

async def main():
    logging.basicConfig(level=logging.INFO)
    logging.info("✅ HTML fixed successfully")
    await init_events_db()
    bot = Bot(
        token=TELEGRAM_BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    dp = Dispatcher()
    dp.include_router(router)
    await drip_campaign.start(bot)
    report_task = asyncio.create_task(daily_report_loop(bot))

    # ВАЖНО: снимаем активный вебхук, чтобы polling заработал
    await bot.delete_webhook(drop_pending_updates=True)

    await on_startup(bot)
    try:
        await dp.start_polling(bot)
    finally:
        report_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await report_task
        await drip_campaign.stop()


if __name__ == "__main__":
    try:
        print(WELCOME)
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("Bot stopped.")
