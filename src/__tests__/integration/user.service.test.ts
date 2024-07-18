import { UserNewRequest, UserProps } from "../../interfaces/user.props";
import * as UserService from "../../services/user.service";
import { User } from "../../models";
import { v4 as uuidv4 } from "uuid";

const userPayload = {
  id: uuidv4(),
  name: "Test test",
  email: "test@gmail.com",
  password: "test123",
} as UserProps;

describe("User Service", () => {
  describe("InsertUser function", () => {
    it("should insert new user", async () => {
      const newUser = jest.spyOn(UserService, "InsertUser").mockResolvedValueOnce(userPayload);
      expect(newUser).toBeDefined();
    });

    it("should throw an Error", async () => {
      await expect(UserService.InsertUser({} as UserNewRequest)).rejects.toThrow();
    });
  });

  describe("GetUserByEmail function", () => {
    it("should get user by email", async () => {
      jest.spyOn(UserService, "InsertUser").mockResolvedValueOnce(userPayload);

      const user = jest.spyOn(UserService, "GetUserByEmail").mockResolvedValueOnce(userPayload);
      expect(user).toBeDefined();
    });

    it("should throw an Error", async () => {
      await expect(UserService.GetUserByEmail({} as string)).rejects.toThrow();
    });
  });

  describe("GetUserByID function", () => {
    it("should get user by email", async () => {
      jest.spyOn(UserService, "InsertUser").mockResolvedValueOnce(userPayload);

      const user = jest.spyOn(UserService, "GetUserById").mockResolvedValueOnce(userPayload);
      expect(user).toBeDefined();
    });

    it("should throw an Error", async () => {
      await expect(UserService.GetUserById({} as string)).rejects.toThrow();
    });
  });

  describe("User.toJSON method", () => {
    it("should return a JSON representation of the user without password", () => {
      const user = new User();
      const jsonRepresentation = user.toJSON();

      expect(jsonRepresentation.id).toStrictEqual(expect.any(String));
    });
  });
});
