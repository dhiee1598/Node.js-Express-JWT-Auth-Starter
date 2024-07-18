import { Router } from "express";
import { ValidateAuthUser, ValidateNewUser } from "../middlewares/request.validator";
import { AuthenticateUser, AuthorizeUser, DeAuthenticateUser, RegisterUser } from "../controllers/user.controller";
import RequiredAuthentication from "../middlewares/auth";

const router = Router();

// * Description:    Create a new user
// * Route:          POST /api/users/auth/sign-up
// * Access:         Public
router.post("/auth/sign-up", ValidateNewUser, RegisterUser);

// * Description:    Authenticate a user
// * Route:          POST /api/users/auth/sign-in
// * Access:         Public
router.post("/auth/sign-in", ValidateAuthUser, AuthenticateUser);

// * Description:    Authorize users
// * Route:          GET /api/users
// * Access:         Private
router.get("/", RequiredAuthentication, AuthorizeUser);

// * Description:    Deauthorize a user
// * Route:          POST /api/users/auth/sign-out
// * Access:         Private
router.post("/auth/sign-out", RequiredAuthentication, DeAuthenticateUser);

export default router;
