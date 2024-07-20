import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { UserAuthRequest, UserNewRequest, UserResponse } from "../interfaces/user.props";
import { GetUserByEmail, GetUserById, InsertUser } from "../services/user.service";
import { HashPassword, IsValidPassword } from "../utilities/password.utils";
import { GenerateAccessToken, GenerateRefreshToken } from "../utilities/generate.token";
import StoreCookieToken from "../utilities/store.cookie";

export const RegisterUser: RequestHandler<
  unknown,
  UserResponse,
  UserNewRequest,
  unknown
> = asyncHandler(async (req, res) => {
  const user = await GetUserByEmail(req.body.email);

  // * Check if the email address is already taken
  if (user) {
    res.status(409);
    // ! Throw Error if email address is already taken
    throw new Error("Email address is already taken.");
  }

  const hashPass = await HashPassword(req.body.password);

  // * Create a new user
  const newUser = await InsertUser({ ...req.body, password: hashPass });

  // * Respond with message and newly created user data
  res.status(201).json({
    message: "New user created successfully.",
    user: newUser,
  });
});

export const AuthenticateUser: RequestHandler<
  unknown,
  UserResponse,
  UserAuthRequest,
  unknown
> = asyncHandler(async (req, res) => {
  const user = await GetUserByEmail(req.body.email);

  // * Check if user is authorize
  if (!user) {
    res.status(401);
    // ! Throw Error if email is invalid
    throw new Error("Email address is invalid");
  }

  if (!(await IsValidPassword(req.body.password, user.password))) {
    res.status(401);
    // ! Throw Error if email is invalid
    throw new Error("Email and password does not match.");
  }

  // * Generate access and refresh tokens for the authenticated user
  const accessToken = GenerateAccessToken(user.id);
  const refreshToken = GenerateRefreshToken(user.id);

  // * Store the refresh token in an HTTP-only cookie
  StoreCookieToken(res, "refreshToken", refreshToken);

  // * Respond with a message and the user. And also the generated access token
  res.status(200).json({
    message: "User successfully authenticated.",
    user: user,
    accessToken: accessToken,
  });
});

export const AuthorizeUser: RequestHandler<unknown, UserResponse, unknown, unknown> =
  asyncHandler(async (req, res) => {
    const id = req.userId;

    const user = await GetUserById(id);

    if (!user) {
      res.status(401);
      // ! Throw Error if user not found
      throw new Error("User not found");
    }

    // * Respond with the fetched user details
    res.status(200).json({
      message: "Authorize user",
      user: user,
    });
  });

export const DeAuthenticateUser: RequestHandler = asyncHandler(async (req, res) => {
  // * Clear the stored refresh token cookie
  res.clearCookie("refreshToken");

  // * Send a success status indicating successful logout
  res.sendStatus(200);
});
