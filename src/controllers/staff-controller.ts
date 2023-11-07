import { Auth } from "../utils";
import { StaffModel } from "../models";
import { Request, Response, NextFunction } from "express";

export class StaffController {
  //
  static async monthlyReport(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    if (session.role != "admin" && session.role != "frontdesk")
      return next(new Error("Permission denied."));
    const resp = await StaffModel.monthlyReport(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/devices");
  }

  // Office Module
  static async office(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "admin"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.office().catch(next);
    resp.data["notifiy"] = 0;
    resp.data["notifications"] = [];
    res.render("s/office", { data: resp.data });
  }

  static async addOffice(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "admin"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.addOffice(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/office");
  }

  static async updateOffice(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "admin"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.updateOffice(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/office");
  }

  // User Module
  static async users(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "admin"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.users().catch(next);
    resp.data["notifiy"] = 0;
    resp.data["notifications"] = [];
    res.render("s/users", { data: resp.data });
  }

  static async addUser(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "admin"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.addUser(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/users");
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "admin"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.updateUser(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/users");
  }

  // Customer Module
  static async customers(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    if (session.role != "admin" && session.role != "frontdesk")
      return next(new Error("Permission denied."));
    let officeId = session.role == "admin" ? null : session.officeId;
    const resp = await StaffModel.customers(officeId).catch(next);
    resp.data["notifiy"] = 0;
    resp.data["notifications"] = [];
    res.render("s/customers", { data: resp.data });
  }

  static async addCustomer(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    if (session.role != "admin" && session.role != "frontdesk")
      return next(new Error("Permission denied."));
    const resp = await StaffModel.addCustomer(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/customers");
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    const resp = await StaffModel.updateCustomer(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/customers");
  }

  // Device Module
  static async devices(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    if (session.role != "admin" && session.role != "frontdesk")
      return next(new Error("Permission denied."));
    let officeId = session.role == "admin" ? null : session.officeId;
    const resp = await StaffModel.devices(officeId).catch(next);
    res.render("s/devices", { data: resp.data });
  }
  //
  static async addDevice(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    if (session.role != "admin" && session.role != "frontdesk")
      return next(new Error("Permission denied."));
    const resp = await StaffModel.addDevice(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/devices");
  }
  //
  static async updateDevice(req: Request, res: Response, next: NextFunction) {
    if (!(new Auth(req).role == "frontdesk"))
      return next(new Error("Permission denied."));
    const resp = await StaffModel.updateDevice(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/devices");
  }

  //
  static async reportedIssue2(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    const resp = await StaffModel.reportedIssue2(session.id).catch(next);
    res.render("s/reported-issue-2", {
      data: { notifiy: 0, notifications: [], data: resp.data },
    });
  }

  // Task Module
  static async reportedIssue(req: Request, res: Response, next: NextFunction) {
    req.params["officeId"] = new Auth(req).officeId;
    const resp = await StaffModel.reportedIssue(req.params).catch(next);
    res.render("s/reported-issue", {
      data: {
        deviceId: req.params["deviceId"],
        notifiy: 0,
        notifications: [],
        data: resp.data,
      },
    });
  }

  static async reportIssue(req: Request, res: Response, next: NextFunction) {
    const session = new Auth(req);
    if (session.role != "admin" && session.role != "frontdesk")
      return next(new Error("Permission denied."));
    let deviceId = req.body["deviceId"];
    const resp = await StaffModel.reportIssue(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect(`/s/reported-issue/${deviceId}`);
  }

  static async updateReportedIssue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const resp = await StaffModel.updateReportedIssue(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    res.redirect("/s/task");
  }

  static async reports(req: Request, res: Response, next: NextFunction) {
    const resp = await StaffModel.reports(req.body).catch(next);
    req.flash(resp.status == true ? "success" : "error", resp.message);
    resp.status == true
      ? res.download(resp.data.file)
      : res.redirect("/s/devices");
  }
}
