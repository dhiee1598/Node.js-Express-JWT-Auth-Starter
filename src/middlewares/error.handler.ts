import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../interfaces/error.props";

export const NotFound = (req: Request, res: Response, next: NextFunction) => {
  // * Set HTTP status code to 404 (Not Found)
  res.status(404);

  // * Create a new Error object with a message indicating the URL that was not found
  const error = new Error(`Route not found: ${req.originalUrl}`);

  // * Pass the error to the next middleware to handle
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ErrorHandler = (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  // * Determine the HTTP status code to send in the response
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // * Set the HTTP status code of the response
  res.status(statusCode);

  // * Send an error response with the error message and stack trace (in development)
  res.json({
    message: error.message,
    stacks: error.stack,
  });
};
