import * as env from "dotenv";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

env.config();
export class Auth {
  public id: number;
  public role: string;
  public tokenId: number;
  public officeId: string;

  constructor(req: Request) {
    try {
      const token = req.cookies.frontdesk || "";
      if (token) {
        const payload = jwt.verify(token, process.env.MACHINE_SECRETE) as any;
        this.id = payload.id;
        this.role = payload.role;
        this.tokenId = payload.tokenId;
        this.officeId = payload.officeId;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
