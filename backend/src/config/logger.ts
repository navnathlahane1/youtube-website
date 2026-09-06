import { env } from './env';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type LogLevel = keyof typeof levels;

class Logger {
  private currentLevel: number;

  constructor() {
    this.currentLevel = levels[env.LOG_LEVEL as LogLevel] ?? 1;
  }

  private format(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? (meta instanceof Error ? `\n${meta.stack}` : ` | ${JSON.stringify(meta)}`) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  debug(message: string, meta?: any) {
    if (this.currentLevel <= levels.debug) {
      console.debug(this.format('debug', message, meta));
    }
  }

  info(message: string, meta?: any) {
    if (this.currentLevel <= levels.info) {
      console.info(this.format('info', message, meta));
    }
  }

  warn(message: string, meta?: any) {
    if (this.currentLevel <= levels.warn) {
      console.warn(this.format('warn', message, meta));
    }
  }

  error(message: string, meta?: any) {
    if (this.currentLevel <= levels.error) {
      console.error(this.format('error', message, meta));
    }
  }
}

export const logger = new Logger();
