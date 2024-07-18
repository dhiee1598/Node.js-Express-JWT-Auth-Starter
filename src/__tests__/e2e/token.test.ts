import request from "supertest";
import ExpressConfig from "../../app";
import { UserAuthRequest, UserProps } from "../../interfaces/user.props";
import { v4 as uuidv4 } from "uuid";
import * as UserService from "../../services/user.service";
import * as Password from "../../utilities/password.utils";
import jwt from "jsonwebtoken";
import env from "../../utilities/env";

const app = ExpressConfig();

const userAuthInput = {
  email: "test@gmail.com",
  password: "test123",
} as UserAuthRequest;

const userPayload = {
  id: uuidv4(),
  name: "Test test",
  email: "test@gmail.com",
  password: "test123",
} as UserProps;

describe("Token", () => {
  const agent = request.agent(app);
  describe("POST /auth/token/renew", () => {
    it("should response with a message of new access token", async () => {
      const { status, body } = await agent.post("/auth/token/renew");

      expect(status).toBe(401);
      expect(body).toHaveProperty("message");
    });

    it("should response with token is invalid", async () => {
      const token = jwt.sign({ userId: userPayload.id }, env.REFRESH_TOKEN_SECRET, { expiresIn: -1 });

      const { status, body } = await agent.post("/auth/token/renew").set("Cookie", `refreshToken=${token}`);

      expect(status).toBe(403);
      expect(body).toHaveProperty("message");
    });

    it("should response with a message of new access token", async () => {
      // @ts-expect-error Something might went wrong
      jest.spyOn(UserService, "GetUserByEmail").mockReturnValueOnce(userPayload);
      // @ts-expect-error Something might went wrong
      jest.spyOn(Password, "IsValidPassword").mockReturnValueOnce(true);

      const loginResponse = await agent.post("/api/users/auth/sign-in").send(userAuthInput);

      const refreshToken = loginResponse.headers["set-cookie"][0].split(";")[0];

      const { status, body } = await agent.post("/auth/token/renew").set("Cookie", refreshToken);

      expect(status).toBe(200);
      expect(body).toHaveProperty("message");
    });
  });
});
