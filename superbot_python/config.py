"""
Configuration file for Multi-Platform SuperBot (Telegram, Bale, Rubika)
Phase 1 - Enterprise Architecture
"""
import os
from typing import List

# ==========================================================
# 1. BOT TOKENS & PLATFORM CREDENTIALS
# ==========================================================
TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "8623750026:AAHWT31Y4IhuthBGWJWMPJGgRTME0w5MF-o")
TELEGRAM_API_ID: int = int(os.getenv("TELEGRAM_API_ID", "24868799"))
TELEGRAM_API_HASH: str = os.getenv("TELEGRAM_API_HASH", "df6c61ace96690c84d482b2776f04ca8")
BALE_BOT_TOKEN: str = os.getenv("BALE_BOT_TOKEN", "1432398423:ZFYQHqmqfSlDn6iinj2BaWEmxiNndrcEMJI")
RUBIKA_BOT_TOKEN: str = os.getenv("RUBIKA_BOT_TOKEN", "CGIHBD0KQDYASEPUOXOOWDFJDTPPHMGNWIMSQIJDOFMBGWYLTIRSLUMIQDVPQLPJ")

# Admin IDs (Can be Telegram, Bale, or Rubika User IDs)
ADMIN_USER_IDS: List[str] = [
    admin_id.strip()
    for admin_id in os.getenv("ADMIN_USER_IDS", "584920194,777000,1001").split(",")
    if admin_id.strip()
]

# ==========================================================
# 2. DATABASE CONFIGURATION
# ==========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH: str = os.getenv("DATABASE_PATH", os.path.join(BASE_DIR, "database", "superbot.sqlite3"))

# ==========================================================
# 3. WEBHOOK & SERVER CONFIGURATION
# ==========================================================
SERVER_HOST: str = os.getenv("SERVER_HOST", "0.0.0.0")
SERVER_PORT: int = int(os.getenv("SERVER_PORT", "8080"))
WEBHOOK_SECRET_TOKEN: str = os.getenv("WEBHOOK_SECRET_TOKEN", "superbot_secure_secret_token_2026")
WEBHOOK_BASE_URL: str = os.getenv("WEBHOOK_BASE_URL", "https://yourdomain.com")

# ==========================================================
# 4. BOT SYSTEM DEFAULTS & ECONOMIC RULES
# ==========================================================
DEFAULT_INITIAL_POINTS: int = 50        # Initial gift points for new users
DEFAULT_INITIAL_DIAMONDS: int = 5       # Initial gift diamonds
REFERRAL_BONUS_REFERRER: int = 25       # Points given to inviter
REFERRAL_BONUS_INVITED: int = 15        # Points given to invitee
DAILY_FREE_POINTS: int = 20             # Daily login gift
DAILY_REQUEST_LIMIT_FREE: int = 30      # Max requests per day for regular users
DAILY_REQUEST_LIMIT_VIP: int = 1000     # Max requests for VIP users
DEFAULT_REQUEST_COST_POINTS: int = 1    # Cost per AI / Media request

# ==========================================================
# 5. PHASE 2 API KEYS (AI, Vision, Media Downloaders & OCR)
# ==========================================================
API_KEYS = {
    "fast_gpt_chat": os.getenv("API_KEY_FAST_GPT_CHAT", "099a9b46e330a6c0b396e95c"),
    "fast_gpt4": os.getenv("API_KEY_FAST_GPT4", "099a9b46e330a6c0b396e95c"),
    "fast_blackbox": os.getenv("API_KEY_FAST_BLACKBOX", "099a9b46e330a6c0b396e95c"),
    "fast_photo": os.getenv("API_KEY_FAST_PHOTO", "099a9b46e330a6c0b396e95c"),
    "fast_ghibli": os.getenv("API_KEY_FAST_GHIBLI", "099a9b46e330a6c0b396e95c"),
    "fast_quality": os.getenv("API_KEY_FAST_QUALITY", "099a9b46e330a6c0b396e95c"),
    "fast_logo": os.getenv("API_KEY_FAST_LOGO", "099a9b46e330a6c0b396e95c"),
    "fast_ig": os.getenv("API_KEY_FAST_IG", "099a9b46e330a6c0b396e95c"),
    "fast_youtube": os.getenv("API_KEY_FAST_YOUTUBE", "099a9b46e330a6c0b396e95c"),
    "fast_spotify": os.getenv("API_KEY_FAST_SPOTIFY", "099a9b46e330a6c0b396e95c"),
    "fast_rj": os.getenv("API_KEY_FAST_RJ", "099a9b46e330a6c0b396e95c"),
    "fast_screen": os.getenv("API_KEY_FAST_SCREEN", "099a9b46e330a6c0b396e95c"),
    "fast_shortener": os.getenv("API_KEY_FAST_SHORTENER", "099a9b46e330a6c0b396e95c"),
    "fast_numberbook": os.getenv("API_KEY_FAST_NUMBERBOOK", "099a9b46e330a6c0b396e95c"),
    "fast_football": os.getenv("API_KEY_FAST_FOOTBALL", "099a9b46e330a6c0b396e95c"),
    "majid_token": os.getenv("API_KEY_MAJID_TOKEN", "mock_majid_token_sec_2026"),
    "majid_compiler": os.getenv("API_KEY_MAJID_COMPILER", "mock_majid_token_sec_2026"),
    "ocr_space": os.getenv("API_KEY_OCR_SPACE", "helloworld"),
}

# Maintenance Mode Flag (can be toggled dynamically via admin panel)
DEFAULT_MAINTENANCE_MODE: bool = False
