# Implementation Plan - MODASR HUBOT Production-Grade Bilingual Installer Repair

## User Request & Requirements
1. Inspect repository state, working tree, and files (`install.sh`, locales, documentation).
2. Complete Persian and English localization (`locales/fa.sh`, `locales/en.sh`) with zero untranslated strings and correct shebangs (`#!/usr/bin/env bash`).
3. Fix main menu and all actions (16 options properly mapped without fake success messages).
4. Prioritize `systemd` service management for production deployment.
5. Secure Bash installer (remove unsafe `eval`, input validation, strict permissions `600` on `.env`, secret masking in logs).
6. Support robust CLI mode (`--help`, `--status`, `--restart`, `--backup`, `--update`, `--uninstall`) without hanging in non-interactive environments.
7. Update documentation (`README.md`, `README_FA.md`, `INSTALL_GUIDE_FA.md`, `INSTALL_GUIDE_EN.md`).
8. Implement comprehensive automated tests in `tests/installer/test_installer.sh`.

## Proposed Changes

### 1. Locale Files (`locales/fa.sh` & `locales/en.sh`)
- Ensure all localization keys exist in both files, cover all 16 menu options, wizard steps, errors, warnings, and successes.

### 2. Root `install.sh` Overhaul
- Implement robust language selection and persistence (`.install_lang`).
- Correctly parse CLI arguments (`--help`, `--status`, `--restart`, `--backup`, `--update`, `--uninstall`) before launching interactive menus.
- Map all 16 menu options to real actions or clear unavailability notices.
- Implement systemd service management as primary process manager.
- Apply security hardening (`set -Eeuo pipefail`, input validation, restrictive permissions).

### 3. Documentation (`README.md`, `README_FA.md`, `INSTALL_GUIDE_FA.md`, `INSTALL_GUIDE_EN.md`)
- Ensure accurate, non-placeholder documentation.

### 4. Automated Testing (`tests/installer/test_installer.sh`)
- Test syntax validation (`bash -n`), locale loading, CLI flags (`--help`, `--status`), language persistence, and non-interactive execution.
