import bcrypt from "bcrypt";

export const HashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch {
    throw new Error("Hashing password failed");
  }
};

export const IsValidPassword = async (password: string, hashPass: string) => {
  try {
    return await bcrypt.compare(password, hashPass);
  } catch {
    throw new Error("Comparing hash password failed");
  }
};
