import { Sequelize } from "sequelize";
import env from "./env";
import pg from "pg";

const sequelize = new Sequelize(env.CONNECTION_URI, { dialectModule: pg, dialect: "postgres" });

export default sequelize;
