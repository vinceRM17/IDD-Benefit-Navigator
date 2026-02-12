/**
 * HIPAA-compliant audit logging with Winston
 * Structured logging with WHO/WHAT/WHEN/WHERE/RESULT fields
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

/**
 * Audit event interface with HIPAA-required fields
 */
export interface AuditEvent {
  who: string; // userId or 'anonymous'
  what: string; // action/operation
  where: string; // IP address and path
  result: number | string; // HTTP status code or result description
  sessionId?: string;
  correlationId: string; // UUID per request
  duration?: number; // Request duration in ms
  metadata?: Record<string, unknown>; // Additional non-sensitive data
}

// Determine log directory from environment or use default
const LOG_DIR = process.env.LOG_DIR || 'logs';

// Create logs directory if it doesn't exist (handled by winston-daily-rotate-file)
const logDir = path.isAbsolute(LOG_DIR) ? LOG_DIR : path.join(process.cwd(), LOG_DIR);

/**
 * Custom format for audit logs
 * Ensures all audit fields are included in the output
 */
const auditFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Detect serverless environment where filesystem is read-only
 */
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * Daily rotating file transports (only used when filesystem is writable)
 */
const fileTransports = isServerless
  ? []
  : [
      new DailyRotateFile({
        filename: path.join(logDir, 'audit-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '90d',
        format: auditFormat,
        level: 'info',
      }),
      new DailyRotateFile({
        filename: path.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '90d',
        format: auditFormat,
        level: 'error',
      }),
    ];

/**
 * Console transport for development
 */
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${timestamp} ${level}: ${message} ${metaStr}`;
    })
  ),
});

/**
 * Winston logger instance for audit logging
 */
export const auditLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: auditFormat,
  transports: [
    ...fileTransports,
    // Use console in development or serverless (where file writes are unavailable)
    ...(process.env.NODE_ENV === 'development' || isServerless
      ? [consoleTransport]
      : []),
  ],
  // Don't exit on handled exceptions
  exitOnError: false,
});

/**
 * Log an audit event with structured HIPAA fields
 * @param event - Audit event with WHO/WHAT/WHEN/WHERE/RESULT
 */
export function logAuditEvent(event: AuditEvent): void {
  const {
    who,
    what,
    where,
    result,
    sessionId,
    correlationId,
    duration,
    metadata,
  } = event;

  auditLogger.info({
    who,
    what,
    where,
    result,
    sessionId: sessionId || 'none',
    correlationId,
    duration: duration || 0,
    ...metadata,
  });
}

/**
 * Log an error with audit context
 */
export function logAuditError(
  error: Error,
  context: Partial<AuditEvent>
): void {
  auditLogger.error({
    message: error.message,
    stack: error.stack,
    ...context,
  });
}
