jest.mock("../../utilities/env", () => ({
  NODE_ENV: "production", // Set to production to test the missing branch
  ACCESS_TOKEN_SECRET: "test-secret",
}));

import { ErrorHandler } from "../../middlewares/error.handler";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../../interfaces/error.props";

describe("Error Handler - Production Environment (CRITICAL FOR 100% COVERAGE)", () => {
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
      statusCode: 500,
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should hide error stack in production mode - THIS COVERS THE MISSING 25%", () => {
    const mockError = new Error("Production error") as ErrorResponse;
    mockError.stack = "Full error stack trace that should be hidden";

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    // In production, stacks should be "🍪" NOT the actual stack
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Production error",
      stacks: "🍪", // This is the production branch
    });
  });

  it("should hide error stack with different status codes in production", () => {
    const mockError = new Error("Not found in production") as ErrorResponse;
    mockError.stack = "Stack trace";
    mockRes.statusCode = 404;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Not found in production",
      stacks: "🍪",
    });
  });

  it("should handle 401 in production", () => {
    const mockError = new Error("Unauthorized") as ErrorResponse;
    mockError.stack = "Stack";
    mockRes.statusCode = 401;

    ErrorHandler(mockError, mockReq as Request, mockRes as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Unauthorized",
      stacks: "🍪",
    });
  });
});
