# Modasr Hubot - Production Installation & Deployment Guide

## 1. Overview
**Modasr Hubot** is an advanced multi-platform bot platform (Telegram, Bale, Rubika & WebApp) with an enterprise-grade bilingual interactive installer and management manager (`install.sh`).

## 2. Supported Operating Systems & System Requirements
- **Operating Systems**: Ubuntu 20.04, 22.04, 24.04 LTS; Debian 11, 12.
- **CPU Architecture**: x86_64 or arm64.
- **RAM**: Minimum 1 GB (2 GB recommended).
- **Disk Space**: 10 GB free space (20 GB NVMe SSD recommended).
- **Privileges**: Root or `sudo` access.

## 3. Installation Instructions & Language Selection
Upon executing the installer for the first time, you will be prompted to select your preferred language:
```bash
[1] فارسی (Persian)
[2] English
```
To run the interactive installer:
```bash
chmod +x install.sh
bash install.sh
```

## 4. Command-Line Interface (CLI) Usage
The installer supports non-interactive and command-line execution:
- `bash install.sh --help` — Display usage help.
- `bash install.sh --lang fa` — Set and use Persian language.
- `bash install.sh --lang en` — Set and use English language.
- `bash install.sh --status` — Check service and health status.
- `bash install.sh --install` — Run fresh installation.
- `bash install.sh --restart` — Restart application service.
- `bash install.sh --update` — Pull and update project safely.
- `bash install.sh --backup` — Create a protected backup archive.
- `bash install.sh --logs` — View recent system logs.
- `bash install.sh --security-check` — Run local security and permission audits.
- `bash install.sh --config` — Edit environment configuration (`.env`).

## 5. Environment Configuration
Environment variables are managed in `.env`. The installer enforces restricted file permissions (`600`) to protect sensitive tokens and database credentials.
Required variables:
- `PORT` (Default: 3000)
- `TELEGRAM_BOT_TOKEN`
- `ADMIN_USER_IDS`

## 6. Service Management (Systemd)
The installer configures a robust `systemd` service named `slowmegabot`:
- Check status: `sudo systemctl status slowmegabot`
- Start: `sudo systemctl start slowmegabot`
- Stop: `sudo systemctl stop slowmegabot`
- Restart: `sudo systemctl restart slowmegabot`

## 7. Backup and Restoration
Backups are created in the `backups/` directory with timestamped filenames (`.tar.gz`), excluding build caches and `node_modules`.
To restore, extract the archive into the project directory and restart the service.

## 8. Security Recommendations
- Keep your `.env` file secure (`chmod 600 .env`).
- Never expose API keys or bot tokens in public logs.
- Regularly run security audits and backups through the management menu.

## 9. Uninstallation
You can remove the managed system service while preserving application data and backups via option 15 in the interactive menu.
