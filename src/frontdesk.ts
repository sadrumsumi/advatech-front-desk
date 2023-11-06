import "reflect-metadata";
import ejs = require("ejs");
import * as env from "dotenv";
import path = require("path");
import cors = require("cors");
import morgan = require("morgan");
import { logger } from "./config";
import express = require("express");
import compression from "compression";
import flash = require("connect-flash");
var session = require("express-session");
import bodyParser = require("body-parser");
import createError = require("http-errors");
import { AppDataSource } from "../ormconfig";
import cookieParser = require("cookie-parser");
import { NextFunction, Request, Response } from "express";
import { browseRoute, staffRoute } from "./routes";

env.config();
AppDataSource.initialize()
  .then(async () => {
    let whitelisted = [];
    let corsOptions = {
      origin: "*",
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 200,
      methods: "POST, GET, HEAD, OPTIONS",
      allowedHeaders: [
        "Origin",
        "Accept",
        "Signature",
        "Timestamp",
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Digest-Method",
        "Signed-Fields",
      ],
    };

    // create express app
    const app = express();

    /**Disable server signatures */
    app.disable("x-powered-by");
    app.disable("e-tag");

    // momery unleaked
    app.set("trust proxy", 1);
    // view engine setup
    app.set("views", path.join(__dirname, "views"));
    app.set("view engine", "ejs");

    app.use(
      session({
        resave: false,
        secret: "Front-Desk",
        cookie: {
          // secure: true,
          maxAge: 60000,
        },
        saveUninitialized: true,
      })
    );

    app.use(flash());
    app.use(compression());
    app.use(morgan("dev"));
    app.use(bodyParser.json());
    app.use(cookieParser("Front-Desk"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(
      express.static(path.join(__dirname, "public"), {
        etag: true,
        maxAge: 3600,
      })
    );

    app.use(express.static(path.join(__dirname, "views")));
    app.use(express.static(path.join(__dirname, "../upload")));
    app.use(
      express.static(path.join(__dirname, "../node_modules/jquery/dist"))
    );
    app.use(
      express.static(path.join(__dirname, "../node_modules/toastr/build"))
    );
    app.use(express.static(path.join(__dirname, "../node_modules/vue/dist")));
    app.use(express.static(path.join(__dirname, "../node_modules/joi/dist")));
    app.use(express.static(path.join(__dirname, "../node_modules/axios/dist")));

    app.use((req: Request, res: Response, next: NextFunction) => {
      req.headers.origin = req.headers.origin || req.headers.host;
      // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    app.use(function (req: any, res: any, next: any) {
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
    });

    // Routes
    app.use("/", browseRoute);
    app.use("/s", staffRoute);

    app.use("*", (req: Request, res: Response, next: NextFunction) => {
      const error: any = new Error(
        `${req.ip} tried to access ${req.originalUrl}`
      );
      error.statusCode = 301;
      next(error);
    });

    // Catch 404 and forward to error handler
    app.use((req: Request, res: Response, next: NextFunction) => {
      logger.error(
        `[${req.ip}][${req.method}] ${req.originalUrl} ${
          req.method === "POST" ? "\n\r" + JSON.stringify(req.body) : ""
        }`
      );
      next(createError(404));
    });

    // error handler
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      if (!error.statusCode) error.statusCode = 500;
      logger.error(error);
      res.render(error.statusCode === 301 ? "error-404" : "error-500", {
        message: error.message,
      });
    });

    // Unhandled Rejection
    process.on("unhandledRejection", (reason, promise) => {
      logger.error(reason);
    });

    // Uncaught Exception
    process.on("uncaughtException", (reason) => {
      logger.error(reason);
    });

    // Start express server
    let server: any = app.listen(
      parseInt(process.env.PORT),
      "0.0.0.0",
      function () {
        const data: any = server.address();
        logger.info(
          `Front-Desk Server-Listen-On: http://${data["address"]}:${data["port"]}`
        );
      }
    );
  })
  .catch((error) => logger.error(error));
