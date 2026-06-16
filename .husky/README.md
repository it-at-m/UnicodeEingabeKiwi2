# Git Hooks

Husky-managed hooks for this repository: `pre-commit`, `commit-msg`.

**Setup (once per clone):**

```bash
npm install
```

The `prepare` script runs automatically and wires Git to `.husky/`.

## Hooks

### `pre-commit`

No-op placeholder. Git always runs `pre-commit` before `commit-msg`; the real checks are in `commit-msg` so the **commit subject is validated first**.

### `commit-msg`

All checks run in this hook, in **fail-fast** order:

1. **Commit message** — subject line from the message file Git passes to this hook
2. **Frontend lint** — `npm run lint` (Prettier, ESLint, `vue-tsc`) when `src/`, `tests/`, or relevant config files are staged
3. **Unit tests** — `npm test` (Vitest) under the same conditions

**Commit message format** (step 1):

```txt
type(PROJECT-123): commit message
type(PROJECT): commit message
```

**Valid types:** `feat`, `fix`, `clean`, `chore`, `docs`

**Valid projects:** `KIWI`, `GH`

**Merge commits**

Git’s default merge subjects (for example `Merge branch 'main' into feature-branch`) are **allowed automatically**.

## Troubleshooting

### Lint fails

```bash
npm run fix
```

### Tests fail

```bash
npm test
```

### Skip hooks temporarily

```bash
git commit --no-verify -m "chore(KIWI): emergency hotfix"
```

Use sparingly — CI still enforces the same checks.
