import { Sequelize } from "sequelize";
import env from "./env";

const sequelize = new Sequelize(env.CONNECTION_URI, { dialect: "mariadb" });

export default sequelize;
