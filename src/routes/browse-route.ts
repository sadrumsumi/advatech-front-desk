import { Router } from "express";
import { BrowseController } from "../controllers";
import { Middleware } from "../utils";

export const browseRoute = Router();

browseRoute.get("/", BrowseController.index);
browseRoute.get("/logout", BrowseController.logout);
browseRoute.get("/sign-in", BrowseController.signIn);
browseRoute.post("/sign-in", BrowseController.postSignIn);
browseRoute.get("/forget-password", BrowseController.forgetPassword);
browseRoute.post("/reset-password", BrowseController.postResetPassword);
browseRoute.get("/profile", Middleware.login, BrowseController.profile);
browseRoute.get("/reset-password/:token", BrowseController.resetPassword);
browseRoute.post("/forget-password", BrowseController.postForgetPassword);
