/**
 * Persistent Database & State Management Service for SlowMegaBot
 * Stores all users, wallets, orders, game sessions, and owner settings to data/bot_database.json
 * Ensures data survives server restarts and crashes.
 */

import fs from 'fs';
import path from 'path';

export interface PersistentDataPayload {
  version: string;
  updatedAt: string;
  stats: {
    totalUsers: number;
    telegramUsers: number;
    baleUsers: number;
    rubikaUsers: number;
    totalOrders: number;
  };
  users: any[];
  wallets: any[];
  orders: any[];
  clashVillages: any[];
  seenOrders: any[];
  ownerConfig: any;
}

class DatabasePersistenceService {
  private dataDir: string;
  private dbPath: string;
  private saveTimeout: NodeJS.Timeout | null = null;
  private isLoaded: boolean = false;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    this.dbPath = path.resolve(this.dataDir, 'bot_database.json');
    this.ensureDataDir();
  }

  private ensureDataDir() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
    } catch (e) {
      console.error('Failed to create data directory:', e);
    }
  }

  /**
   * Loads saved database from disk into botStorage on server startup
   */
  public load(botStorage: any): boolean {
    try {
      if (!fs.existsSync(this.dbPath)) {
        console.log('[Database] No existing bot_database.json found. Initializing empty dataset.');
        this.saveNow(botStorage);
        this.isLoaded = true;
        return false;
      }

      const raw = fs.readFileSync(this.dbPath, 'utf-8');
      const data: PersistentDataPayload = JSON.parse(raw);

      if (data && typeof botStorage.importData === 'function') {
        botStorage.importData(data);
        console.log(
          `[Database] Successfully loaded ${data.users?.length || 0} users and ${data.wallets?.length || 0} wallets from ${this.dbPath}`
        );
      }

      this.isLoaded = true;
      return true;
    } catch (err) {
      console.error('[Database] Failed to load bot_database.json:', err);
      return false;
    }
  }

  /**
   * Schedules a debounced disk write (1000ms delay to batch fast updates)
   */
  public scheduleSave(botStorage: any) {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveNow(botStorage);
    }, 1000);
  }

  /**
   * Writes the current botStorage state immediately to disk
   */
  public saveNow(botStorage: any) {
    try {
      this.ensureDataDir();
      if (!botStorage || typeof botStorage.exportData !== 'function') {
        return;
      }

      const payload = botStorage.exportData();
      fs.writeFileSync(this.dbPath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write bot_database.json:', err);
    }
  }

  public getDbPath(): string {
    return this.dbPath;
  }

  public getRawData(): any {
    try {
      if (fs.existsSync(this.dbPath)) {
        return JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
      }
    } catch {}
    return null;
  }
}

export const databasePersistenceService = new DatabasePersistenceService();
