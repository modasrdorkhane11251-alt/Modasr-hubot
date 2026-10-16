# Implementation Plan - Production-Grade Bilingual Installer & Deployment Manager

## User Request & Requirements
1. Inspect main branch and latest commits.
2. Modify root `install.sh` to fully integrate bilingual support.
3. At startup, display working language selection menu (`[1] فارسی`, `[2] English`) when no preference file exists.
4. Load selected locale from `locales/fa.sh` or `locales/en.sh`.
5. Connect localized variables to all installer steps, prompts, errors, and management menus.
6. Persist selected language in `.install_lang` and allow changing via menu option 13.
7. Ensure management options report accurate operation status (no fake successes).
8. Populate complete, non-placeholder documentation in `INSTALL_GUIDE_EN.md` and `README_FA.md`.
9. Review and harden installer security (no `eval`, secret masking, robust backup/restore).
10. Implement thorough automated testing in `tests/installer/test_installer.sh`.

## Proposed Changes

### 1. Locale Files Enhancement (`locales/fa.sh` & `locales/en.sh`)
- Expand locale keys to cover all wizard steps, prompts, success messages, error states, and management options.

### 2. Root `install.sh` Overhaul
- Implement robust `select_language` function at startup (prompting user if `.install_lang` is missing).
- Replace hardcoded Persian strings with localized variables `$L_...`.
- Implement safe execution traps (`set -Eeuo pipefail` where compatible, secret masking, etc.).

### 3. Documentation Completion (`INSTALL_GUIDE_EN.md` & `README_FA.md`)
- Provide comprehensive, accurate documentation for both languages.

### 4. Automated Testing (`tests/installer/test_installer.sh`)
- Test locale selection, non-interactive language preference injection, syntax check, and status reporting.
