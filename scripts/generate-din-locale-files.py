#!/usr/bin/env python3
"""
Build per-locale DIN character JSON files from the master DIN keyboard data.

Requires: openpyxl, and the String.Latin+ 1.2 xlsx at:
  /tmp/din-spec-91379.xlsx  (from StringLatin 1.2 zip:
  https://www.xoev.de/sixcms/media.php/13/StringLatin%2012.zip
  -> 02-weitere-dateien/2018-11-15_din-spec-91379.xlsx)

Output: src/data/characters-din-locales/*.json (full character objects, copied from master)
Master file characters-DIN-SPEC-91379.json is never modified.
"""

from __future__ import annotations

import json
import unicodedata
from pathlib import Path

try:
    import openpyxl
except ImportError as exc:
    raise SystemExit("Install openpyxl: pip install openpyxl") from exc

ROOT = Path(__file__).resolve().parents[1]
MASTER_PATH = ROOT / "src/data/characters-DIN-SPEC-91379.json"
OUT_DIR = ROOT / "src/data/characters-din-locales"
XLSX_PATH = Path("/tmp/din-spec-91379.xlsx")

LOCALES = {
    "locale-de": {"countries": ["DE"], "names": {"de": "Deutsch (DIN)", "en": "German (DIN)"}},
    "locale-at": {
        "countries": ["AT"],
        "names": {"de": "Österreich (DIN)", "en": "Austrian German (DIN)"},
    },
    "locale-fr": {"countries": ["FR"], "names": {"de": "Französisch (DIN)", "en": "French (DIN)"}},
    "locale-es": {"countries": ["ES"], "names": {"de": "Spanisch (DIN)", "en": "Spanish (DIN)"}},
    "locale-it": {"countries": ["IT"], "names": {"de": "Italienisch (DIN)", "en": "Italian (DIN)"}},
    "locale-nl": {
        "countries": ["NL"],
        "names": {"de": "Niederländisch (DIN)", "en": "Dutch (DIN)"},
    },
    "locale-pl": {"countries": ["PL"], "names": {"de": "Polnisch (DIN)", "en": "Polish (DIN)"}},
    "locale-cs": {"countries": ["CZ"], "names": {"de": "Tschechisch (DIN)", "en": "Czech (DIN)"}},
    "locale-sk": {"countries": ["SK"], "names": {"de": "Slowakisch (DIN)", "en": "Slovak (DIN)"}},
    "locale-hu": {"countries": ["HU"], "names": {"de": "Ungarisch (DIN)", "en": "Hungarian (DIN)"}},
    "locale-ro": {"countries": ["RO"], "names": {"de": "Rumänisch (DIN)", "en": "Romanian (DIN)"}},
    "locale-hr": {"countries": ["HR"], "names": {"de": "Kroatisch (DIN)", "en": "Croatian (DIN)"}},
    "locale-sl": {"countries": ["SI"], "names": {"de": "Slowenisch (DIN)", "en": "Slovenian (DIN)"}},
    "locale-et": {"countries": ["EE"], "names": {"de": "Estnisch (DIN)", "en": "Estonian (DIN)"}},
    "locale-lv": {"countries": ["LV"], "names": {"de": "Lettisch (DIN)", "en": "Latvian (DIN)"}},
    "locale-lt": {"countries": ["LT"], "names": {"de": "Litauisch (DIN)", "en": "Lithuanian (DIN)"}},
    "locale-fi": {"countries": ["FI"], "names": {"de": "Finnisch (DIN)", "en": "Finnish (DIN)"}},
    "locale-se": {"countries": ["SE"], "names": {"de": "Schwedisch (DIN)", "en": "Swedish (DIN)"}},
    "locale-da": {"countries": ["DK"], "names": {"de": "Dänisch (DIN)", "en": "Danish (DIN)"}},
    "locale-no": {"countries": ["NO"], "names": {"de": "Norwegisch (DIN)", "en": "Norwegian (DIN)"}},
    "locale-is": {"countries": ["IS"], "names": {"de": "Isländisch (DIN)", "en": "Icelandic (DIN)"}},
    "locale-pt": {
        "countries": ["PT"],
        "names": {"de": "Portugiesisch (DIN)", "en": "Portuguese (DIN)"},
    },
    "locale-mt": {"countries": ["MT"], "names": {"de": "Maltesisch (DIN)", "en": "Maltese (DIN)"}},
    "locale-tr": {"countries": ["TR"], "names": {"de": "Türkisch (DIN)", "en": "Turkish (DIN)"}},
    "locale-ie": {"countries": ["IE"], "names": {"de": "Irisch (DIN)", "en": "Irish (DIN)"}},
    "locale-wel": {"countries": ["UK-WEL"], "names": {"de": "Walisisch (DIN)", "en": "Welsh (DIN)"}},
}


def cp_to_char(cp: str) -> str:
    if not cp:
        return ""
    return unicodedata.normalize("NFC", "".join(chr(int(p, 16)) for p in str(cp).split()))


def parse_countries(s) -> list[str]:
    if not s:
        return []
    s = str(s).strip()
    if s == "?":
        return []
    if s.startswith("SMI"):
        return ["NO", "FI", "SE"]
    if s.startswith("("):
        s = s.strip("()")
    return [p.strip() for p in s.split(",") if p.strip()]


def main() -> None:
    if not XLSX_PATH.is_file():
        raise SystemExit(f"Missing xlsx at {XLSX_PATH} — extract from String.Latin+ 1.2 zip")

    master = json.loads(MASTER_PATH.read_text(encoding="utf-8"))
    chars = master["characters"]

    by_key: dict[tuple[str, str | None], dict] = {}
    for c in chars:
        name = unicodedata.normalize("NFC", c["name"])
        by_key[(name, c.get("case", "undef"))] = c
        by_key.setdefault((name, None), c)

    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb["Tabelle1"]
    headers = None
    rows = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            headers = [str(h).replace("ns1:", "") if h else "" for h in row]
            continue
        rows.append(dict(zip(headers, row)))

    country_glyphs: dict[str, set[str]] = {}
    for r in rows:
        if r.get("group") != "Latein. Buchstaben (normativ)":
            continue
        ch = cp_to_char(r.get("cp"))
        if not ch:
            continue
        for cc in parse_countries(r.get("countries")):
            country_glyphs.setdefault(cc, set()).add(ch)

    basic_ids = {
        c["id"]
        for c in chars
        if len(c["name"]) == 1 and c["name"].isascii() and c["name"].isalpha()
    }

    def match_char(glyph: str) -> list[dict]:
        found = []
        for case in ("capital", "small", "undef"):
            c = by_key.get((glyph, case))
            if c:
                found.append(c)
        if not found:
            c = by_key.get((glyph, None))
            if c:
                found.append(c)
        return found

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for lid, meta in LOCALES.items():
        glyphs: set[str] = set()
        for cc in meta["countries"]:
            glyphs |= country_glyphs.get(cc, set())
        ids = set(basic_ids)
        for g in glyphs:
            for c in match_char(g):
                ids.add(c["id"])
        subset_letters = [
            c
            for c in chars
            if c["id"] in ids and ("id1" in c.get("profiles", []) or c["id"] in basic_ids)
        ]
        payload = {
            "id": lid,
            "names": meta["names"],
            "countryCodes": meta["countries"],
            "characters": subset_letters,
        }
        fname = lid.replace("locale-", "") + ".json"
        (OUT_DIR / fname).write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"{lid}: {len(subset_letters)} characters")

    index = {
        "source": "DIN SPEC 91379 annex countries (String.Latin+ 1.2 xlsx)",
        "master": "characters-DIN-SPEC-91379.json",
        "locales": [
            {
                "id": lid,
                "file": f"characters-din-locales/{lid.replace('locale-', '')}.json",
                "countryCodes": meta["countries"],
                "names": meta["names"],
            }
            for lid, meta in LOCALES.items()
        ],
    }
    (OUT_DIR / "index.json").write_text(
        json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {len(LOCALES)} locale files to {OUT_DIR}")


if __name__ == "__main__":
    main()
