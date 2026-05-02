from dataclasses import dataclass
import os


@dataclass(frozen=True)
class BotConfig:
    mini_app_url: str = os.getenv("MINI_APP_URL", "https://jyotishgpt.ru/tools")


config = BotConfig()
