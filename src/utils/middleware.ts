import * as env from "dotenv";
import { logger } from "../config";
import * as jwt from "jsonwebtoken";
import { BrowseModel } from "../models";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

env.config();
export class Middleware {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (typeof req.cookies.frontdesk == "undefined") {
        req.flash("error", "Your session has expired. Please log in again.");
        res.redirect("/");
      } else {
        let payload: any = jwt.verify(
          req.cookies.frontdesk,
          process.env.MACHINE_SECRETE
        );
        let status = await BrowseModel.checkToken({ id: payload.token_id });
        status == true ? next() : res.redirect("/logout");
      }
    } catch (error) {
      logger.error(error);
      if (error instanceof JsonWebTokenError) {
        res.render("login", {
          title: "Home",
          error: "Your session has expired. Please log in again.",
        });
      }
    }
  }

  static logout(req: Request, res: Response, next: NextFunction) {
    try {
      jwt.verify(req.cookies.frontdesk, process.env.MACHINE_SECRETE);
      res.redirect("/");
    } catch (error) {
      logger.error(error);
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        next();
      }
    }
  }
}
