# DIN locale character subsets

Each `*.json` file here is a **subset** of `characters-DIN-SPEC-91379.json` (same object shape per character). The master file stays complete and is still the single source loaded for the DIN keyboard.

- **Filter “Deutsch (DIN)”** → uses `de.json` (country code `DE` from the DIN annex). Replaces the former separate “Deutsche Tastatur” (8 keys).

Regenerate after master DIN data changes:

```bash
# Place 2018-11-15_din-spec-91379.xlsx in /tmp/din-spec-91379.xlsx (from String.Latin+ 1.2 zip)
npm run generate:din-locales
```
