import { UserNewRequest } from "../interfaces/user.props";
import { User } from "../models";

export const GetUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ where: { email: email } });
  } catch {
    throw Error("Failed to fetch data! Please try again.");
  }
};

export const InsertUser = async (values: UserNewRequest) => {
  try {
    return await User.create(values);
  } catch {
    throw Error("Failed to insert data! Please try again.");
  }
};

export const GetUserById = async (id: string) => {
  try {
    return await User.findByPk(id);
  } catch {
    throw Error("Failed to fetch User data! Please try again.");
  }
};
