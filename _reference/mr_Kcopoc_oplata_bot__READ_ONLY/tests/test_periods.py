from datetime import date, datetime
from pathlib import Path
import sys
import calendar

sys.path.append(str(Path(__file__).resolve().parents[1]))

from unittest.mock import patch

from bot import (
    LEAP_DAY_FALLBACK_DAY,
    LEAP_DAY_FALLBACK_MONTH,
    WEEKDAY_MAP,
    build_rows,
    calc_destiny,
    calc_expression,
    reduce_to_digit,
    render_months_text,
    render_periods_text,
    resolve_period_years,
    sum_digits,
)


def test_build_rows_1965_sample():
    rows = build_rows(date(1965, 12, 23), range(2021, 2025))
    assert rows == [
        {"year": 2021, "marker": "", "weekday": "3", "year_suffix": "21", "main": "5", "background": "7"},
        {"year": 2022, "marker": "", "weekday": "6", "year_suffix": "22", "main": "9", "background": "8"},
        {"year": 2023, "marker": "", "weekday": "8", "year_suffix": "23", "main": "3", "background": "9"},
        {"year": 2024, "marker": "", "weekday": "2", "year_suffix": "24", "main": "7", "background": "1"},
    ]


def test_build_rows_1989_sample():
    rows = build_rows(date(1989, 1, 27), range(2024, 2027))
    assert rows == [
        {"year": 2024, "marker": "", "weekday": "8", "year_suffix": "24", "main": "6", "background": "9"},
        {"year": 2025, "marker": "", "weekday": "2", "year_suffix": "25", "main": "1", "background": "1"},
        {"year": 2026, "marker": "", "weekday": "9", "year_suffix": "26", "main": "9", "background": "2"},
    ]


def _anniversary_date(birth_date: date, year: int) -> date:
    if birth_date.month == 2 and birth_date.day == 29:
        if calendar.isleap(year):
            return date(year, 2, 29)
        return date(year, LEAP_DAY_FALLBACK_MONTH, LEAP_DAY_FALLBACK_DAY)
    return date(year, birth_date.month, birth_date.day)


def _assert_rows_follow_formulas(birth_date: date, years):
    expression = calc_expression(birth_date)
    destiny = calc_destiny(birth_date)
    rows = build_rows(birth_date, years)

    for row in rows:
        year = row["year"]
        anniversary = _anniversary_date(birth_date, year)
        expected_weekday = WEEKDAY_MAP[anniversary.weekday()]
        assert row["weekday"] == str(expected_weekday)

        year_suffix_value = int(row["year_suffix"])
        expected_main = reduce_to_digit(expected_weekday + year_suffix_value + expression)
        assert row["main"] == str(expected_main)

        year_root = reduce_to_digit(sum_digits(year))
        expected_background = reduce_to_digit(destiny + year_root)
        assert row["background"] == str(expected_background)


def test_build_rows_leap_day_uses_calendar_and_policy():
    birth = date(2000, 2, 29)
    rows = build_rows(birth, [2023, 2024, 2025])
    assert rows == [
        {"year": 2023, "marker": "", "weekday": "5", "year_suffix": "23", "main": "5", "background": "4"},
        {"year": 2024, "marker": "", "weekday": "3", "year_suffix": "24", "main": "4", "background": "5"},
        {"year": 2025, "marker": "", "weekday": "8", "year_suffix": "25", "main": "1", "background": "6"},
    ]


def test_build_rows_before_leap_day_matches_calendar_weekday():
    birth = date(1991, 2, 10)
    _assert_rows_follow_formulas(birth, [2023, 2024, 2025])


def test_build_rows_after_leap_day_matches_calendar_weekday():
    birth = date(1991, 6, 15)
    _assert_rows_follow_formulas(birth, [2023, 2024, 2025])


def test_render_periods_text_layout():
    text = render_periods_text(date(1989, 1, 27), range(2024, 2027))
    assert text == (
        "🗓 Периоды 2024–2026\n\n"
        "<pre> 8   2   9\n"
        "24  25  26\n"
        " 6   1   9\n"
        " 9   1   2</pre>"
    )


def test_render_months_text_layout():
    text = render_months_text(date(1989, 1, 27))
    assert text == (
        "📆 Месяцы\n\n"
        "<pre>1  2  3  4  5  6  7  8  9  10  11  12\n"
        "2  3  4  5  6  7  8  9  1   2   3   4\n"
        "2  3  4  5  6  7  8  9  1   2   3   4</pre>"
    )


class _FixedDateTime(datetime):
    @classmethod
    def now(cls, tz=None):
        return cls(2025, 5, 17, tzinfo=tz)


def test_resolve_period_years_balanced_window():
    birth = date(1990, 6, 7)
    with patch("bot.datetime", _FixedDateTime):
        years = resolve_period_years("±5", birth)

    assert years == list(range(2020, 2031))


def test_resolve_period_years_forward_window():
    birth = date(2000, 1, 1)
    with patch("bot.datetime", _FixedDateTime):
        years = resolve_period_years("+10", birth)

    assert years == list(range(2025, 2036))


def test_resolve_period_years_backward_window():
    birth = date(2018, 12, 11)
    with patch("bot.datetime", _FixedDateTime):
        years = resolve_period_years("-10", birth)

    assert years == list(range(2018, 2026))
