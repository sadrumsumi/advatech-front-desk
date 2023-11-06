import * as env from "dotenv";
import * as jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

env.config();

/** */
const genarate = (data: Genarate): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = jwt.sign(
        {
          id: data.id,
          role: data.role,
          token_id: data.tokenId,
          officeId: data.officeId,
        },
        process.env.MACHINE_SECRETE,
        { expiresIn: "2h", algorithm: "HS256" }
      );
      resolve(token);
    } catch (error) {
      reject(error.toString());
    }
  });
};

/** */
const forgetPassword = (data: ForgetPassword): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = jwt.sign(
        {
          id: data.id,
          tokenId: data.tokenId,
        },
        process.env.MACHINE_SECRETE,
        { expiresIn: "2h", algorithm: "HS256" }
      );
      resolve(token);
    } catch (error) {
      reject(error.toString());
    }
  });
};

/** */
const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies.pos || "";
  try {
    if (!token) {
      res.send({ status: 401, message: "You are not authorized." });
    } else {
      jwt.verify(token, process.env.MACHINE_SECRETE);
      next();
    }
  } catch (error) {
    if (error["message"] == "invalid token") {
      res.send({ status: 401, message: error["message"] });
    } else {
      res.send({ status: 401, message: error });
    }
  }
};

export const token = { genarate, forgetPassword, verify };

interface Genarate {
  id: number;
  role: string;
  tokenId: number;
  officeId: number;
}

interface ForgetPassword {
  id: number;
  tokenId: number;
}
