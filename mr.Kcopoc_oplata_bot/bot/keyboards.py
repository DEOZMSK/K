from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo

from .config import config


def build_main_menu_reply_keyboard() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="💳 Оплата"), KeyboardButton(text="📚 Мои материалы")],
            [KeyboardButton(text="🛟 Поддержка"), KeyboardButton(text="🔮 Мини‑приложение", web_app=WebAppInfo(url=config.mini_app_url))],
        ],
        resize_keyboard=True,
    )


def build_main_menu_inline_keyboard() -> InlineKeyboardMarkup:
    """Fallback для старых клиентов/сценариев: обычная ссылка на tools."""
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔮 Мини‑приложение", url=config.mini_app_url)],
        ]
    )
