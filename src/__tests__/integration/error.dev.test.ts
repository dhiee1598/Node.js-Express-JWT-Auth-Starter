import { ErrorHandler } from "../../middlewares/error.handler";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../../interfaces/error.props";

describe("Error Handler Middleware - Development Mode", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockRes = {
      statusCode: 200,
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should use status 500 when res.statusCode is 200", () => {
    const mockError = new Error("Test error") as ErrorResponse;
    mockError.stack = "Error stack trace";

    mockRes.statusCode = 200;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalled();
  });

  it("should use existing statusCode when not 200", () => {
    const mockError = new Error("Not found") as ErrorResponse;
    mockError.stack = "Error stack trace";

    mockRes.statusCode = 404;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
  });

  it("should show error stack in development mode", () => {
    const mockError = new Error("Development error") as ErrorResponse;
    mockError.stack = "Full error stack trace for debugging";

    mockRes.statusCode = 500;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(jsonMock).toHaveBeenCalledWith({
      message: "Development error",
      stacks: "Full error stack trace for debugging",
    });
  });

  it("should handle 400 status code", () => {
    const mockError = new Error("Bad request") as ErrorResponse;
    mockError.stack = "Stack trace";
    mockRes.statusCode = 400;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
  });

  it("should handle 401 status code", () => {
    const mockError = new Error("Unauthorized") as ErrorResponse;
    mockError.stack = "Stack trace";
    mockRes.statusCode = 401;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
  });

  it("should handle 403 status code", () => {
    const mockError = new Error("Forbidden") as ErrorResponse;
    mockError.stack = "Stack trace";
    mockRes.statusCode = 403;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(403);
  });

  it("should handle 409 status code", () => {
    const mockError = new Error("Conflict") as ErrorResponse;
    mockError.stack = "Stack trace";
    mockRes.statusCode = 409;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(409);
  });

  it("should handle 500 status code", () => {
    const mockError = new Error("Server error") as ErrorResponse;
    mockError.stack = "Stack trace";
    mockRes.statusCode = 500;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
  });
});
