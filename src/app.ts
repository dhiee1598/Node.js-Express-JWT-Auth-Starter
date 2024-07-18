import express, { Request, Response, Application } from "express";
import { ErrorHandler, NotFound } from "./middlewares/error.handler";
import UserRoutes from "./routes/user.routes";
import TokenRoutes from "./routes/token.routes";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import env from "./utilities/env";
import morgan from "morgan";
import cors from "cors";

const ExpressConfig = (): Application => {
  const app = express();

  // * MIDDLEWARE SETUP
  app.use(morgan("dev")); // Log HTTP requests to the console in development mode
  app.use(cookieParser()); // Parse cookies attached to the requests
  app.use(bodyParser.json()); // Parse JSON bodies of requests
  app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies of requests
  app.use(
    cors({
      credentials: true, // Allow requests from the specified frontend origin
      origin: env.FRONTEND_URL, // Allow sending cookies from frontend to backend
    })
  );

  // * MAIN HEALTH CHECK ROUTE
  app.get("/main/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({ message: "HAPPY CODING - 👋✨🌍" });
  });

  // * API ROUTES FOR USERS
  app.use("/api/users", UserRoutes);

  // * API ROUTES FOR TOKEN
  app.use("/auth/token", TokenRoutes);

  // ! CATCH ALL ERROR HANDLING
  app.use(NotFound); // Handle 404 errors (Not Found)
  app.use(ErrorHandler); // Handle all other errors

  return app;
};

export default ExpressConfig;
