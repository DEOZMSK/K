import asyncio
import logging
import sqlite3
from dataclasses import dataclass
from datetime import datetime, time, timedelta
from pathlib import Path
from typing import List, Optional
from zoneinfo import ZoneInfo

from aiogram import Bot
from aiogram.exceptions import TelegramBadRequest, TelegramForbiddenError
from aiogram.types import FSInputFile, InlineKeyboardButton, InlineKeyboardMarkup

from analytics import log_event

MOSCOW_TZ = ZoneInfo("Europe/Moscow")
UTC = ZoneInfo("UTC")


def _serialize_ts(value: datetime) -> float:
    return value.astimezone(UTC).timestamp()


def _deserialize_ts(value: float) -> datetime:
    return datetime.fromtimestamp(value, tz=UTC)


def _interval_days_for_index(index: int) -> int:
    return 2 if index < 2 else index + 1


def _calculate_run_at(first_seen: datetime, video_index: int) -> datetime:
    moscow_first_seen = first_seen.astimezone(MOSCOW_TZ)
    total_days = sum(_interval_days_for_index(i) for i in range(video_index + 1))
    target_date = moscow_first_seen.date() + timedelta(days=total_days)
    target_dt = datetime.combine(target_date, time(22, 22), tzinfo=MOSCOW_TZ)
    return target_dt.astimezone(UTC)


def _ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


@dataclass
class DripState:
    user_id: int
    first_seen: datetime
    next_video_index: int
    next_run_at: datetime
    completed: bool
    unavailable: bool


class VideoLibrary:
    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self._cache: List[Path] = []
        self._cache_ts: Optional[datetime] = None
        self._cache_ttl = timedelta(minutes=30)

    def list_videos(self) -> List[Path]:
        now = datetime.now(tz=UTC)
        if self._cache_ts and (now - self._cache_ts) < self._cache_ttl:
            return list(self._cache)
        videos: List[Path] = []
        for item in self.folder.iterdir():
            if not item.is_file():
                continue
            name = item.name
            if name.startswith("videom (") and name.lower().endswith(".mp4"):
                videos.append(item)
        self._cache = sorted(videos, key=self._extract_index)
        self._cache_ts = now
        return list(self._cache)

    @staticmethod
    def _extract_index(path: Path) -> int:
        name = path.stem
        start = name.find("(")
        end = name.find(")")
        if start == -1 or end == -1 or end <= start + 1:
            return 0
        try:
            return int(name[start + 1:end])
        except ValueError:
            return 0

    def get_video(self, index: int) -> Optional[Path]:
        videos = self.list_videos()
        if 0 <= index < len(videos):
            return videos[index]
        return None


class DripStorage:
    def __init__(self, db_path: Path) -> None:
        self.db_path = db_path
        _ensure_parent(self.db_path)
        self._lock = asyncio.Lock()
        self._init_db()

    def _init_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS drip_users (
                user_id INTEGER PRIMARY KEY,
                first_seen_ts REAL NOT NULL,
                next_video_index INTEGER NOT NULL,
                next_run_ts REAL NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                unavailable INTEGER NOT NULL DEFAULT 0
            );
            """
        )
        conn.commit()
        conn.close()

    async def _execute(self, query: str, params: tuple = (), fetch: str = ""):
        def _run():
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cur = conn.execute(query, params)
            conn.commit()
            if fetch == "one":
                row = cur.fetchone()
                conn.close()
                return row
            if fetch == "all":
                rows = cur.fetchall()
                conn.close()
                return rows
            conn.close()
            return None

        return await asyncio.to_thread(_run)

    async def get_state(self, user_id: int) -> Optional[DripState]:
        async with self._lock:
            row = await self._execute(
                "SELECT * FROM drip_users WHERE user_id = ?", (user_id,), fetch="one"
            )
        if not row:
            return None
        return DripState(
            user_id=row["user_id"],
            first_seen=_deserialize_ts(row["first_seen_ts"]),
            next_video_index=row["next_video_index"],
            next_run_at=_deserialize_ts(row["next_run_ts"]),
            completed=bool(row["completed"]),
            unavailable=bool(row["unavailable"]),
        )

    async def upsert_state(self, state: DripState) -> None:
        async with self._lock:
            await self._execute(
                """
                INSERT INTO drip_users (user_id, first_seen_ts, next_video_index, next_run_ts, completed, unavailable)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    first_seen_ts=excluded.first_seen_ts,
                    next_video_index=excluded.next_video_index,
                    next_run_ts=excluded.next_run_ts,
                    completed=excluded.completed,
                    unavailable=excluded.unavailable
                """,
                (
                    state.user_id,
                    _serialize_ts(state.first_seen),
                    state.next_video_index,
                    _serialize_ts(state.next_run_at),
                    int(state.completed),
                    int(state.unavailable),
                ),
            )

    async def get_due_states(self, now: datetime) -> List[DripState]:
        async with self._lock:
            rows = await self._execute(
                """
                SELECT * FROM drip_users
                WHERE completed = 0 AND unavailable = 0 AND next_run_ts <= ?
                """,
                (_serialize_ts(now),),
                fetch="all",
            )
        return [
            DripState(
                user_id=row["user_id"],
                first_seen=_deserialize_ts(row["first_seen_ts"]),
                next_video_index=row["next_video_index"],
                next_run_at=_deserialize_ts(row["next_run_ts"]),
                completed=bool(row["completed"]),
                unavailable=bool(row["unavailable"]),
            )
            for row in rows
        ]

    async def mark_completed(self, user_id: int) -> None:
        async with self._lock:
            await self._execute(
                "UPDATE drip_users SET completed = 1 WHERE user_id = ?",
                (user_id,),
            )

    async def mark_unavailable(self, user_id: int) -> None:
        async with self._lock:
            await self._execute(
                "UPDATE drip_users SET unavailable = 1 WHERE user_id = ?",
                (user_id,),
            )


class DripCampaign:
    def __init__(self, storage: DripStorage, library: VideoLibrary, timezone_name: str) -> None:
        self.storage = storage
        self.library = library
        self.timezone_name = timezone_name
        self.bot: Optional[Bot] = None
        self._task: Optional[asyncio.Task] = None
        self._stopped = asyncio.Event()

    async def start(self, bot: Bot) -> None:
        self.bot = bot
        try:
            db_path = self.storage.db_path.resolve()
        except FileNotFoundError:
            db_path = self.storage.db_path.resolve(strict=False)
        try:
            videos_path = self.library.folder.resolve()
        except FileNotFoundError:
            videos_path = self.library.folder.resolve(strict=False)
        videos_count = len(self.library.list_videos())
        logging.info("Drip campaign paths: db=%s videos_dir=%s", db_path, videos_path)
        logging.info("Drip campaign videos found: %s", videos_count)
        self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        self._stopped.set()
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

    async def ensure_started_for_user(self, user_id: int, first_seen: Optional[datetime] = None) -> None:
        if not first_seen:
            first_seen = datetime.now(tz=UTC)

        existing = await self.storage.get_state(user_id)
        if existing:
            return

        videos = self.library.list_videos()
        if not videos:
            logging.warning("Drip campaign skipped start: no videos found")
            return

        next_run_at = _calculate_run_at(first_seen, 0)
        state = DripState(
            user_id=user_id,
            first_seen=first_seen,
            next_video_index=0,
            next_run_at=next_run_at,
            completed=False,
            unavailable=False,
        )
        await self.storage.upsert_state(state)

    async def _run(self) -> None:
        assert self.bot, "Bot must be set before running drip campaign"
        while not self._stopped.is_set():
            try:
                await self._process_due()
            except Exception:
                logging.exception("Drip campaign loop error")
            await asyncio.sleep(600)

    async def _process_due(self) -> None:
        if not self.bot:
            return

        now = datetime.now(tz=UTC)
        states = await self.storage.get_due_states(now)
        for state in states:
            await self._process_state(state)

    async def _process_state(self, state: DripState) -> None:
        if not self.bot:
            return

        video_path = self.library.get_video(state.next_video_index)
        videos = self.library.list_videos()
        if not video_path:
            await self.storage.mark_completed(state.user_id)
            return

        markup = InlineKeyboardMarkup(
            inline_keyboard=[[InlineKeyboardButton(text="выбрать время", url="https://www.jyotishgpt.ru/book")]]
        )

        try:
            await log_event(state.user_id, "booking_click", {"source": "drip"})
            await self.bot.send_video(
                chat_id=state.user_id,
                video=FSInputFile(video_path),
                supports_streaming=True,
                reply_markup=markup,
            )
        except TelegramForbiddenError:
            logging.info("User %s is unavailable, stopping drip", state.user_id)
            await self.storage.mark_unavailable(state.user_id)
            return
        except TelegramBadRequest as exc:
            logging.exception("Failed to send drip video to %s: %s", state.user_id, exc)
            return

        next_index = state.next_video_index + 1
        if next_index >= len(videos):
            await self.storage.mark_completed(state.user_id)
            return

        next_run_at = _calculate_run_at(state.first_seen, next_index)
        updated_state = DripState(
            user_id=state.user_id,
            first_seen=state.first_seen,
            next_video_index=next_index,
            next_run_at=next_run_at,
            completed=False,
            unavailable=False,
        )
        await self.storage.upsert_state(updated_state)
