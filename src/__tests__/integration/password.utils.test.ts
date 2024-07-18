import bcrypt from "bcrypt";
import * as Password from "../../utilities/password.utils";

jest.mock("bcrypt");

describe("Password Utilities", () => {
  describe("HashPassword function", () => {
    it("should hash the password", async () => {
      const plainPassword = "password123";
      const mockedHashedPassword = "hashedPassword123";

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockedHashedPassword);

      const hashedPassword = await Password.HashPassword(plainPassword);

      expect(hashedPassword).toBe(mockedHashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });

    it("should throw an error when hashing fails", async () => {
      const plainPassword = "password123";
      const errorMessage = "Hashing password failed";

      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error(errorMessage));
      await expect(Password.HashPassword(plainPassword)).rejects.toThrow(errorMessage);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });
  });

  describe("IsValidPassword function", () => {
    it("should return true if password is valid", async () => {
      const plainPassword = "password123";
      const mockedHashedPassword = "hashedPassword123";
      const hashPass = await Password.HashPassword(mockedHashedPassword);

      const mockValue = jest.spyOn(Password, "IsValidPassword").mockResolvedValue(true);
      const hashedPassword = await Password.IsValidPassword(plainPassword, hashPass);

      expect(hashedPassword).toBe(true);
      expect(mockValue).toHaveBeenCalledWith(plainPassword, hashPass);
    });

    it("should return false if password is invalid", async () => {
      const plainPassword = "password123";
      const mockedHashedPassword = "hashedPassword123";

      const hashPass = await Password.HashPassword(mockedHashedPassword);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const hashedPassword = await Password.IsValidPassword(plainPassword, hashPass);

      expect(hashedPassword).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashPass);
    });

    it("should throw an error when comparing password fails", async () => {
      const plainPassword = "password123";
      const hashPass = await Password.HashPassword(plainPassword);
      const errorMessage = "Comparing hash password failed";

      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error(errorMessage));
      await expect(Password.IsValidPassword(plainPassword, hashPass)).rejects.toThrow(errorMessage);
    });
  });
});
