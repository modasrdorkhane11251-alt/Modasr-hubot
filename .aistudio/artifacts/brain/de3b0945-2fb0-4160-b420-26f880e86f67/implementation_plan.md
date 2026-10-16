# Implementation Plan - Admin Panel Environment Variables Manager

## User Request & Preference
- Add an Environment Variables manager directly inside the Admin Panel as a dedicated tab where the user can view, edit, and save `.env` variables in one place.

## Proposed Changes

### 1. Backend API Endpoints (`server.ts`)
- Implement `GET /api/admin/env`: reads `.env` file (or `process.env`) and returns key-value pairs (with secure handling).
- Implement `POST /api/admin/env`: updates `.env` file with new values and updates `process.env` dynamically.

### 2. Frontend Admin Tab (`ModuleControlCenter.tsx` or new component)
- Add a new tab option in the Admin Control Center: "مدیریت Env (متغیرهای محیطی)".
- Provide a clean, modern UI with search, list of all environment variables (`TELEGRAM_BOT_TOKEN`, `BALE_BOT_TOKEN`, `RUBIKA_BOT_TOKEN`, `GEMINI_API_KEY`, `RAPIDAPI_KEY`, etc.), input fields, show/hide value toggles, and a "ذخیره همه تغییرات" (Save All Changes) button.

### 3. Verification
- Test GET and POST `/api/admin/env` endpoints.
- Run `npm run lint` and `npm run build`.
