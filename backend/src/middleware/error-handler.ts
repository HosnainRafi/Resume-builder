import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Custom error interface for structured errors
export class CustomError extends Error {
  // <-- Changed to exportable class
  statusCode: number;
  code: string;
  details?: any;
  requestId?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    // Set the prototype explicitly to make 'instanceof' work correctly
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// Global error handler middleware
const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  // This 'req.headers['x-request-id']' might not be available if error occurs very early or pino-http is not used
  // Or if it's not explicitly passed in 'req'
  // For a robust solution, consider passing the requestId via context or ensuring pino-http assigns it early.
  const requestId = err.requestId || _req.headers['x-request-id'] || 'N/A';

  // Ensure the error response always has the expected structure
  const errorResponse = {
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.',
      details: err.details,
      requestId: requestId,
    },
  };

  // Log the error with relevant context
  logger.error(
    {
      err: err, // Log the full error object for debugging
      requestId: requestId,
      path: _req.path,
      method: _req.method,
      statusCode: statusCode,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack in dev
    },
    `Error: ${err.message}`
  );

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
