require("dotenv").config();
import { join } from "path";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  port: 3306,
  type: "mysql",
  username: "root",
  host: "localhost",
  dropSchema: false,
  synchronize: true,
  migrationsRun: false,
  database: "frontdesk",
  password: "px@advatech",
  logging: ["warn", "error"],
  extra: {
    ssl: false,
    // ssl: {
    //   rejectUnauthorized: true,
    // },
  },
  entities: [join(__dirname, "src/entities/*{.ts,.js}")],
  migrations: [join(__dirname, "src/migrations/*{.ts,.js}")],
  logger: process.env.NODE_ENV === "production" ? "file" : "debug",
});
