import asyncio
import json
import logging
import sqlite3
from datetime import datetime, time, timedelta, timezone
from pathlib import Path
from typing import Dict, Optional, Tuple

DB_PATH = Path("/data/events.sqlite3")


def _ensure_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            event_name TEXT NOT NULL,
            ts DATETIME DEFAULT CURRENT_TIMESTAMP,
            meta TEXT
        );
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS daily_reports_sent (
            report_date TEXT PRIMARY KEY
        );
        """
    )
    conn.commit()
    conn.close()


async def init_events_db() -> None:
    try:
        await asyncio.to_thread(_ensure_db)
    except Exception:
        logging.exception("Failed to initialize events database")


async def log_event(user_id: int, event_name: str, meta: Optional[Dict] = None) -> None:
    try:
        payload = json.dumps(meta, ensure_ascii=False) if meta else None

        def _insert() -> None:
            conn = sqlite3.connect(DB_PATH)
            conn.execute(
                "INSERT INTO events (user_id, event_name, meta) VALUES (?, ?, ?)",
                (user_id, event_name, payload),
            )
            conn.commit()
            conn.close()

        await asyncio.to_thread(_insert)
    except Exception:
        logging.exception("Failed to log event %s for user %s", event_name, user_id)


async def get_event_stats(days: int) -> Tuple[int, int, Dict[str, int]]:
    def _fetch() -> Tuple[int, int, Dict[str, int]]:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row

        local_days = max(days, 1)
        start_date = datetime.utcnow().date() - timedelta(days=local_days - 1)
        start_dt = datetime.combine(start_date, time.min)
        start_str = start_dt.strftime("%Y-%m-%d %H:%M:%S")

        total_events = conn.execute(
            "SELECT COUNT(*) AS cnt FROM events WHERE ts >= ?",
            (start_str,),
        ).fetchone()["cnt"]
        unique_users = conn.execute(
            "SELECT COUNT(DISTINCT user_id) AS cnt FROM events WHERE ts >= ?",
            (start_str,),
        ).fetchone()["cnt"]

        rows = conn.execute(
            "SELECT event_name, COUNT(*) AS cnt FROM events WHERE ts >= ? GROUP BY event_name",
            (start_str,),
        ).fetchall()
        conn.close()

        counts = {row["event_name"]: row["cnt"] for row in rows}
        return unique_users, total_events, counts

    return await asyncio.to_thread(_fetch)


async def get_event_stats_for_period(start_dt: datetime, end_dt: datetime) -> Tuple[int, int, Dict[str, int]]:
    def _fetch() -> Tuple[int, int, Dict[str, int]]:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row

        start_utc = start_dt.astimezone(timezone.utc)
        end_utc = end_dt.astimezone(timezone.utc)
        start_str = start_utc.strftime("%Y-%m-%d %H:%M:%S")
        end_str = end_utc.strftime("%Y-%m-%d %H:%M:%S")

        total_events = conn.execute(
            "SELECT COUNT(*) AS cnt FROM events WHERE ts >= ? AND ts < ?",
            (start_str, end_str),
        ).fetchone()["cnt"]
        unique_users = conn.execute(
            "SELECT COUNT(DISTINCT user_id) AS cnt FROM events WHERE ts >= ? AND ts < ?",
            (start_str, end_str),
        ).fetchone()["cnt"]

        rows = conn.execute(
            "SELECT event_name, COUNT(*) AS cnt FROM events WHERE ts >= ? AND ts < ? GROUP BY event_name",
            (start_str, end_str),
        ).fetchall()
        conn.close()

        counts = {row["event_name"]: row["cnt"] for row in rows}
        return unique_users, total_events, counts

    return await asyncio.to_thread(_fetch)


async def was_daily_report_sent(report_date: str) -> bool:
    def _fetch() -> bool:
        conn = sqlite3.connect(DB_PATH)
        row = conn.execute(
            "SELECT 1 FROM daily_reports_sent WHERE report_date = ?",
            (report_date,),
        ).fetchone()
        conn.close()
        return row is not None

    return await asyncio.to_thread(_fetch)


async def mark_daily_report_sent(report_date: str) -> None:
    def _insert() -> None:
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            "INSERT OR IGNORE INTO daily_reports_sent (report_date) VALUES (?)",
            (report_date,),
        )
        conn.commit()
        conn.close()

    await asyncio.to_thread(_insert)
