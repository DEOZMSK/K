"""Эталонные сценарии для блока Периоды (выписаны из доступных материалов Stage 2)."""

REFERENCE_SCENARIOS = [
    {
        "id": "periods_baseline_1989_01_27",
        "input": {"birth_date": "1989-01-27", "mode": "±5", "current_year": 2025},
        "expected": {
            "rangeLabel": "2020–2030",
            "sample_rows": [
                {"year": 2024, "marker": "", "weekday": "8", "yearSuffix": "24", "main": "6", "background": "9"},
                {"year": 2025, "marker": "", "weekday": "2", "yearSuffix": "25", "main": "1", "background": "1"},
                {"year": 2026, "marker": "", "weekday": "9", "yearSuffix": "26", "main": "9", "background": "2"},
            ],
        },
    },
    {
        "id": "periods_feb_29_rollover",
        "input": {"birth_date": "2000-02-29", "mode": "±5", "current_year": 2025},
        "expected": {
            "rangeLabel": "2020–2030",
            "sample_rows": [
                {"year": 2023, "marker": "", "weekday": "5", "yearSuffix": "23", "main": "5", "background": "4"},
                {"year": 2024, "marker": "", "weekday": "3", "yearSuffix": "24", "main": "4", "background": "5"},
                {"year": 2025, "marker": "", "weekday": "8", "yearSuffix": "25", "main": "1", "background": "6"},
            ],
            "rule": "Для 29.02 в невисокосный год использовать 01.03",
        },
    },
]
