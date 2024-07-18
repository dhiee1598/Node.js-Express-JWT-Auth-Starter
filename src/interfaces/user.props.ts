import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export interface UserProps extends Model<InferAttributes<UserProps>, InferCreationAttributes<UserProps>> {
  id: CreationOptional<string>;
  name: string;
  email: string;
  password: string;
}

export interface UserNewRequest extends Omit<UserProps, "id"> {}

export interface UserAuthRequest extends Omit<UserProps, "id" | "name"> {}

export interface UserResponse {
  message?: string;
  user?: UserProps;
  accessToken?: string;
}
