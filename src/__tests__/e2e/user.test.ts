import request from "supertest";
import ExpressConfig from "../../app";
import { v4 as uuidv4 } from "uuid";
import * as UserService from "../../services/user.service";
import * as Password from "../../utilities/password.utils";
import { UserAuthRequest, UserNewRequest, UserProps } from "../../interfaces/user.props";
import jwt from "jsonwebtoken";
import env from "../../utilities/env";
import { GenerateAccessToken } from "../../utilities/generate.token";

const app = ExpressConfig();

const userPayload = {
  id: uuidv4(),
  name: "Test test",
  email: "test@gmail.com",
  password: "test123",
} as UserProps;

const userNewInput = {
  name: "Test test",
  email: "test@gmail.com",
  password: "test123",
} as UserNewRequest;

const userAuthInput = {
  email: "test@gmail.com",
  password: "test123",
} as UserAuthRequest;

describe("Users API", () => {
  describe("POST /api/users/auth/sign-up", () => {
    it("should response with a bad request", async () => {
      const { status, body } = await request(app).post("/api/users/auth/sign-up");

      expect(status).toBe(400);
      expect(body).toHaveProperty("message");
    });

    it("should response with a bad request due to unexpected field", async () => {
      const { status, body } = await request(app)
        .post("/api/users/auth/sign-up")
        .send({ ...userNewInput, random: "Hello" });

      expect(status).toBe(400);
      expect(body).toHaveProperty("message");
    });

    it("should response with a conflict of email address", async () => {
      const mockUserEmail = jest
        .spyOn(UserService, "GetUserByEmail")
        // @ts-expect-error Something might went wrong
        .mockReturnValueOnce(userPayload);
      const { status, body } = await request(app)
        .post("/api/users/auth/sign-up")
        .send(userNewInput);

      expect(status).toBe(409);
      expect(body).toHaveProperty("message");
      expect(body.message).toBe("Email address is already taken.");
      expect(mockUserEmail).toHaveBeenCalled();
    });

    it("should response with a success message and a status code of 201", async () => {
      // @ts-expect-error Something might went wrong
      jest.spyOn(UserService, "InsertUser").mockReturnValueOnce(userPayload);

      const { status, body } = await request(app)
        .post("/api/users/auth/sign-up")
        .send(userNewInput);

      expect(status).toBe(201);
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("user");
      expect(body.user).toStrictEqual(userPayload);
    });

    it("should response with a status code of 500", async () => {
      const mockUserInsert = jest
        .spyOn(UserService, "InsertUser")
        .mockRejectedValueOnce("Oh now");
      const { status } = await request(app)
        .post("/api/users/auth/sign-up")
        .send(userNewInput);

      expect(status).toBe(500);
      expect(mockUserInsert).toHaveBeenCalled();
    });
  });

  describe("POST /api/users/auth/sign-in", () => {
    it("should response with a bad request", async () => {
      const { status, body } = await request(app).post("/api/users/auth/sign-in");

      expect(status).toBe(400);
      expect(body).toHaveProperty("message");
    });

    it("should response with a bad request due to unexpected field", async () => {
      const { status, body } = await request(app)
        .post("/api/users/auth/sign-in")
        .send({ ...userAuthInput, random: "Hello" });

      expect(status).toBe(400);
      expect(body).toHaveProperty("message");
    });

    it("should response with an invalid email address", async () => {
      const mockUserEmail = jest
        .spyOn(UserService, "GetUserByEmail")
        // @ts-expect-error Something might went wrong
        .mockReturnValueOnce(null);
      const { status, body } = await request(app)
        .post("/api/users/auth/sign-in")
        .send(userAuthInput);

      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
      expect(mockUserEmail).toHaveBeenCalled();
    });

    it("should response with an email and password does not match", async () => {
      // @ts-expect-error Something might went wrong
      jest.spyOn(UserService, "GetUserByEmail").mockReturnValueOnce(userPayload);
      // @ts-expect-error Something might went wrong
      jest.spyOn(Password, "IsValidPassword").mockReturnValueOnce(false);

      const { status, body } = await request(app)
        .post("/api/users/auth/sign-in")
        .send(userAuthInput);

      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
    });

    it("should response with a user is authenticated", async () => {
      // @ts-expect-error Something might went wrong
      jest.spyOn(UserService, "GetUserByEmail").mockReturnValueOnce(userPayload);

      const mockPassword = jest
        .spyOn(Password, "IsValidPassword")
        // @ts-expect-error Something might went wrong
        .mockReturnValueOnce(true);

      const { status, body, headers } = await request(app)
        .post("/api/users/auth/sign-in")
        .send(userAuthInput);

      expect(status).toBe(200);
      expect(mockPassword).toHaveBeenCalledWith(
        userAuthInput.password,
        userPayload.password
      );
      expect(body).toHaveProperty("message");
      expect(body).toHaveProperty("user");
      expect(body).toHaveProperty("accessToken");
      expect(body.message).toBe("User successfully authenticated.");
      expect(body.user).toStrictEqual(userPayload);
      expect(headers["set-cookie"]).toBeDefined();
    });
  });

  describe("GET /api/users", () => {
    it("should response with a status of 401 user is unauthorize", async () => {
      const { status, body } = await request(app).get("/api/users");

      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
      expect(body.message).toBe("Authorization header with token is required.");
    });

    it("should response with token is invalid", async () => {
      const { status } = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer asddadas`);
      expect(status).toBe(403);
    });

    it("should response with token is expired", async () => {
      const token = jwt.sign({ userId: "sample" }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: -1,
      });

      const { status, body } = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
      expect(body.message).toBe("The provided token has expired.");
    });

    it("should response with user not found", async () => {
      // @ts-expect-error Something might went wrong
      jest.spyOn(UserService, "GetUserById").mockReturnValueOnce(null);
      const accessToken = GenerateAccessToken(userPayload.id);

      const { status, body } = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
    });

    it("should return the authorize user", async () => {
      // @ts-expect-error Something might went wrong
      jest.spyOn(UserService, "GetUserById").mockReturnValueOnce(userPayload);

      const accessToken = GenerateAccessToken(userPayload.id);

      const { status, body } = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(status).toBe(200);
      expect(body).toHaveProperty("user");
    });
  });

  describe("POST /api/users/auth/sign-out", () => {
    it("should response with a status of 401 user is unauthorize", async () => {
      const { status, body } = await request(app).post("/api/users/auth/sign-out");

      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
      expect(body.message).toBe("Authorization header with token is required.");
    });

    it("should response with token is invalid", async () => {
      const { status } = await request(app)
        .post("/api/users/auth/sign-out")
        .set("Authorization", `Bearer asddadas`);
      expect(status).toBe(403);
    });

    it("should response with token is expired", async () => {
      const token = jwt.sign({ userId: "sample" }, env.ACCESS_TOKEN_SECRET, {
        expiresIn: -1,
      });

      const { status, body } = await request(app)
        .post("/api/users/auth/sign-out")
        .set("Authorization", `Bearer ${token}`);
      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
      expect(body.message).toBe("The provided token has expired.");
    });

    it("should response with status code of 200", async () => {
      const accessToken = GenerateAccessToken(userPayload.id);
      const { status } = await request(app)
        .post("/api/users/auth/sign-out")
        .set("Authorization", `Bearer ${accessToken}`);
      expect(status).toBe(200);
    });
  });
});
