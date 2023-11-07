import { Auth } from "../utils";
import { BrowseModel, StaffModel } from "../models";
import { Request, Response, NextFunction } from "express";

export class BrowseController {
  /**  */
  static async index(req: Request, res: Response, next: NextFunction) {
    var session = new Auth(req);
    if (typeof session.id === "undefined") {
      res.render("signin", { data: [] });
    } else {
      let officeId = session.role == "admin" ? null : session.officeId;
      const resp = await StaffModel.devices(officeId).catch(next);
      session.role == "technician"
        ? res.redirect("/s/reported-issue")
        : res.render("s/devices", { session, data: resp.data });
    }
  }

  /**  */
  static signIn(req: Request, res: Response, next: NextFunction) {
    res.render("signin", { data: [] });
  }

  /**  */
  static async postSignIn(req: Request, res: Response, next: NextFunction) {
    let resp = await BrowseModel.postSignIn(req.body).catch(next);

    if (resp["status"]) {
      // expire after 1h
      const expiration = 3600000;
      res.cookie("frontdesk", `${resp["data"]["token"]}`, {
        secure: false,
        httpOnly: true,
        expires: new Date(Date.now() + expiration),
      });
    }
    req.flash(resp["status"] == true ? "success" : "error", resp["message"]);
    res.redirect("/");
  }

  // Reset password
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const resp = await BrowseModel.resetPassword(req.params).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    resp.status == true
      ? res.render("reset-password", { data: resp.data })
      : res.redirect("/forget-password");
  }

  // Forget password
  static async postForgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const resp = await BrowseModel.postForgetPassword(req.body, req).catch(
      next
    );
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect(resp.status == true ? `/` : "/forget-password");
  }

  // Reset password
  static async postResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const resp = await BrowseModel.postResetPassword(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect(
      resp.status == true ? "/" : `/reset-password/${req.body["token"]}`
    );
  }

  // Get profile
  static async profile(req: Request, res: Response, next: NextFunction) {
    let options: any = {};
    const session = new Auth(req);
    options["userId"] = session.id;
    const resp = await BrowseModel.profile(options).catch(next);
    res.render("profile", { data: resp.message });
  }

  // Update profile
  static async postProfile(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    req.body["userId"] = session.id;
    const resp = await BrowseModel.postProfile(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/profile");
  }

  // Forget password
  static async forgetPassword(req: Request, res: Response, next: NextFunction) {
    res.render("forget-password", { data: {} });
  }

  // Logout user
  static async logout(req: Request, res: Response, next: NextFunction) {
    await BrowseModel.disableToken({ id: new Auth(req).tokenId }).catch(next);
    res.clearCookie("frontdesk", { secure: false, httpOnly: true });
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  }
}
