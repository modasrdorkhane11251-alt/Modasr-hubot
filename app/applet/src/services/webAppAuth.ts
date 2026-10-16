import crypto from 'crypto';

export interface WebAppUserData {
  id: number | string;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
}

export interface WebAppAuthResult {
  ok: boolean;
  user?: WebAppUserData;
  platform?: 'telegram' | 'bale' | 'rubika';
  error?: string;
  authDate?: number;
}

export interface BotTokenConfig {
  telegram?: string;
  bale?: string;
  rubika?: string;
}

/**
 * Validates HMAC SHA-256 signatures for Telegram WebApp initData
 */
function verifyTelegramInitData(initDataStr: string, botToken: string): { isValid: boolean; parsedData: Record<string, string> } {
  const parsedData: Record<string, string> = {};
  if (!initDataStr) return { isValid: false, parsedData };

  try {
    const params = new URLSearchParams(initDataStr);
    let hash = '';

    const dataCheckArr: string[] = [];
    params.forEach((value, key) => {
      if (key === 'hash') {
        hash = value;
      } else {
        dataCheckArr.push(`${key}=${value}`);
      }
    });

    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    params.forEach((value, key) => {
      parsedData[key] = value;
    });

    if (!botToken || !hash) {
      // In demo/test environment without token or hash
      return { isValid: true, parsedData };
    }

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const computedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const isValid = computedHash.toLowerCase() === hash.toLowerCase();
    return { isValid, parsedData };
  } catch (err) {
    return { isValid: false, parsedData };
  }
}

/**
 * Authenticates WebApp initData for Telegram, Bale, or Rubika
 */
export function authenticateWebAppUser(
  platform: 'telegram' | 'bale' | 'rubika',
  initDataStr: string,
  botTokens: BotTokenConfig = {}
): WebAppAuthResult {
  if (!initDataStr || !initDataStr.trim()) {
    // Guest / Mock User for browser simulator testing outside messengers
    return {
      ok: true,
      platform,
      user: {
        id: 12345678,
        firstName: 'کاربر مهمان وب‌اپ',
        username: 'guest_webapp_user',
      },
      authDate: Math.floor(Date.now() / 1000),
    };
  }

  const token = botTokens[platform] || '';
  const { isValid, parsedData } = verifyTelegramInitData(initDataStr, token);

  if (!isValid && token) {
    return {
      ok: false,
      error: 'امضای HMAC داده‌های WebApp معتبر نیست یا منقضی شده است.',
    };
  }

  let userObj: WebAppUserData | undefined = undefined;

  if (parsedData.user) {
    try {
      const u = JSON.parse(parsedData.user);
      userObj = {
        id: u.id || u.user_id || 12345678,
        firstName: u.first_name || u.firstName || 'کاربر وب‌اپ',
        lastName: u.last_name || u.lastName,
        username: u.username,
        languageCode: u.language_code || 'fa',
        isPremium: Boolean(u.is_premium),
      };
    } catch {
      // Fallback
    }
  }

  if (!userObj) {
    userObj = {
      id: parsedData.user_id || 12345678,
      firstName: parsedData.first_name || 'کاربر وب‌اپ',
      username: parsedData.username || `wa_${platform}_user`,
    };
  }

  const authDate = parsedData.auth_date ? parseInt(parsedData.auth_date, 10) : Math.floor(Date.now() / 1000);

  return {
    ok: true,
    platform,
    user: userObj,
    authDate,
  };
}

/**
 * Builds an inline keyboard WebApp button formatted for the target platform
 */
export function buildWebAppButton(
  platform: 'telegram' | 'bale' | 'rubika',
  webAppUrl: string,
  buttonText: string = '🎮 ورود به بازی مافیا (Mini App)'
) {
  if (platform === 'telegram' || platform === 'bale') {
    return { text: buttonText, web_app: { url: webAppUrl } };
  }
  return { text: buttonText, url: webAppUrl };
}
