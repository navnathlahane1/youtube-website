export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: any) {
    super(message, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', details?: any) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied: insufficient permissions', details?: any) {
    super(message, 403, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: any) {
    super(message, 400, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, 422, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists or conflict occurred', details?: any) {
    super(message, 409, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later', details?: any) {
    super(message, 429, details);
  }
}
