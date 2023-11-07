import { Router } from "express";
import { StaffController } from "../controllers";
import { Middleware } from "../utils";

export const staffRoute = Router();

//
staffRoute.post("/reports", Middleware.login, StaffController.reports)
staffRoute.post("/monthly-report", Middleware.login, StaffController.monthlyReport)

// Office Module
staffRoute.get("/office", Middleware.login, StaffController.office);
staffRoute.post("/add-office", Middleware.login, StaffController.addOffice);
staffRoute.post("/update-office", Middleware.login, StaffController.updateOffice);

// User Module
staffRoute.get("/users", Middleware.login, StaffController.users);
staffRoute.post("/add-user", Middleware.login, StaffController.addUser);
staffRoute.post("/update-user", Middleware.login, StaffController.updateUser);

// Customer Module
staffRoute.get("/customers", Middleware.login, StaffController.customers);
staffRoute.post("/add-customer", Middleware.login, StaffController.addCustomer);
staffRoute.post("/update-customer", Middleware.login, StaffController.updateCustomer);

// Device Module
staffRoute.get("/devices", Middleware.login, StaffController.devices);
staffRoute.post("/add-device", Middleware.login, StaffController.addDevice);
staffRoute.post("/update-device", Middleware.login, StaffController.updateDevice);

// Task Module
staffRoute.post("/report-issue", Middleware.login, StaffController.reportIssue);
staffRoute.post("/update-reported-issue", Middleware.login, StaffController.updateReportedIssue);
staffRoute.get("/reported-issue/:deviceId", Middleware.login, StaffController.reportedIssue);
staffRoute.get("/reported-issue", Middleware.login, StaffController.reportedIssue2);
