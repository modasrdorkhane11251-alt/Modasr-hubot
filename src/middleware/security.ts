import { Request, Response, NextFunction } from 'express';

/**
 * Validates admin API key from X-Admin-Key header or admin_key query parameter
 * Expected value in ADMIN_API_KEY environment variable
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const providedKey =
    (req.headers['x-admin-key'] as string) ||
    (req.query.admin_key as string) ||
    '';

  const expectedKey = process.env.ADMIN_API_KEY || 'slowmega_admin_secret_key_2026';

  if (!providedKey || providedKey !== expectedKey) {
    console.warn(
      `[SECURITY] Unauthorized admin access attempt to ${req.method} ${req.path} from IP ${req.ip || req.socket.remoteAddress}`
    );
    return res.status(401).json({ ok: false, error: 'دسترسی غیرمجاز. کلید مدیریت (X-Admin-Key) نامعتبر است.' });
  }

  next();
}

/**
 * Validates Telegram Webhook Secret Token header (X-Telegram-Bot-Api-Secret-Token)
 */
export function requireTelegramSecret(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const provided = (req.headers['x-telegram-bot-api-secret-token'] as string) || '';
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!expected) {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    return res.status(500).json({ ok: false, error: 'TELEGRAM_WEBHOOK_SECRET is not configured' });
  }

  if (provided !== expected) {
    console.warn(`[SECURITY] Invalid Telegram webhook request from IP ${req.ip || req.socket.remoteAddress}`);
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  next();
}

/**
 * Validates N8n internal API secret header (X-N8n-Secret or Authorization Bearer)
 */
export function requireN8nSecret(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const provided =
    (req.headers['x-n8n-secret'] as string) ||
    (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '') ||
    '';
  const expected = process.env.N8N_INTERNAL_SECRET;

  if (!expected) {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }
    return res.status(500).json({ ok: false, error: 'N8N_INTERNAL_SECRET is not configured' });
  }

  if (provided !== expected) {
    console.warn(`[SECURITY] Invalid n8n API request from IP ${req.ip || req.socket.remoteAddress} for ${req.path}`);
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  next();
}

/**
 * Lightweight sliding window in-memory Rate Limiter
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore: Map<string, RateLimitRecord> = new Map();

// Periodic cleanup every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) rateLimitStore.delete(key);
  }
}, 60_000);

export function rateLimit(options: {
  windowMs?: number;
  max?: number;
  keyGenerator?: (req: Request) => string;
  message?: string;
}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 60;
  const keyGenerator =
    options.keyGenerator ||
    ((req) => (req.ip || req.socket.remoteAddress || 'unknown') as string);
  const message = options.message || 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.';

  return (req: Request, res: Response, next: NextFunction) => {
    const key = `${req.path}:${keyGenerator(req)}`;
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        ok: false,
        error: message,
        retryAfterSeconds: retryAfter,
      });
    }

    record.count += 1;
    next();
  };
}
