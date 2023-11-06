import * as env from "dotenv";
import { TokenEntity, UserEntity } from "../entities";
import * as jwt from "jsonwebtoken";
import { password, send, token, validate } from "../utils";
import { Request } from "express";

env.config();
export class BrowseModel {
  /**  */
  static index(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  /**  */
  static postSignIn(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const validationResult = await validate.signin(body);
        if (validationResult.status) {
          const user = await UserEntity.findOne({
            relations: ["role", "office"],
            where: {
              phoneNumber: body.username,
            },
          });

          if (user) {
            const compare = await password.compare({
              hash: user.password,
              password: body.password,
            });

            if (compare.status) {
              // insert new token
              const newToken = new TokenEntity({ user });
              await newToken.save();

              // generate token
              const generateToken = await token.genarate({
                id: user.id,
                role: user.role.type,
                tokenId: newToken.id,
                officeId: user.office.id,
              });

              // Give feedback
              resolve({
                status: true,
                message: "Success",
                data: { token: generateToken },
              });
            } else {
              resolve({
                status: false,
                message: "Invalid username or password",
                data: null,
              });
            }
          } else {
            resolve({
              status: false,
              message: "Invalid username or password",
              data: null,
            });
          }
        } else {
          resolve(validationResult);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Reset password, verify token
  static resetPassword(options: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get token payload
        const payload: any = jwt.verify(
          options.token,
          process.env.MACHINE_SECRETE
        );

        // Check token validity
        const checkToken = await TokenEntity.findOneBy({
          status: 0,
          id: payload.tokenId,
        });

        if (checkToken) {
          resolve({
            status: true,
            message: "",
            data: { token: options.token },
          });
        } else {
          resolve({
            status: false,
            message: "Something's went wrong try again later.",
            data: null,
          });
        }
      } catch (error) {
        if (error["message"] == "invalid token") {
          // Give feedback
          resolve({
            status: false,
            message: "Something's went wrong try again later.",
            data: null,
          });
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Something's went wrong try again later.",
            data: null,
          });
        }
      }
    });
  }

  /**  */
  static profile(options: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get user
        const user = await UserEntity.findOneBy({ id: options["userId"] });
        // Give feedback
        resolve({
          status: true,
          message: {
            newPassword: "e",
            confirmPassword: "e",
            currentPassword: "e",
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phoneNumber,
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**  */
  static profileImage(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve({ status: true, message: "" });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**  */
  static postProfile(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get user informations
        const user = await UserEntity.findOneBy({ id: body["userId"] });

        // Check password
        if (body["newPassword"] != "" || body["confirmPassword"] != "") {
          // Check if password match
          const checkPassord = await validate.changePassword({
            new_password: body["newPassword"],
            confirm_password: body["confirmPassword"],
          });

          // Give feedback
          if (!checkPassord.status) {
            resolve({ status: false, message: checkPassord.message });
          } else {
            // Check on provided password
            if (body["currentPassword"] != "") {
              // Validate current password
              const { status } = await password.compare({
                hash: user.password,
                password: body["currentPassword"],
              });
              // Give feedback
              if (status) {
                // Generate passwore
                const hashPassword = await password.hash({
                  password: `${body["newPassword"]}`.trim(),
                });

                user.password = hashPassword;
                await user.save();
              } else {
                resolve({
                  status: false,
                  message: "You provide wrong details.",
                });
              }
            } else {
              resolve({ status: false, message: "Provide current password." });
            }
          }
        }

        // Check on other provided details
        let options: any[] = [];

        if (body["phone"] != body["old_phone"]) {
          options.push({ phone_number: body["phone"] });
        }

        if (body["email"] != body["old_email"]) {
          options.push({ email_address: body["email"] });
        }

        let checkUser: UserEntity;
        if (Object.keys(options).length > 0) {
          checkUser = await UserEntity.findOne({ where: options });
        }

        if (checkUser == null || typeof checkUser == "undefined") {
          await UserEntity.update(user.id, {
            firstName: body["firstName"],
            lastName: body["lastName"],
            phoneNumber: body["phoneNumber"],
          });
          // Give feedback
          resolve({ status: true, message: "Account is up to date." });
        } else {
          // Give feedback
          resolve({ status: false, message: "Data belong's to someone else." });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  // Reset password
  static postResetPassword(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Get token payload
        const payload: any = jwt.verify(
          body.token,
          process.env.MACHINE_SECRETE
        );
        // Check token validity
        const checkToken = await TokenEntity.findOne({
          relations: ["user"],
          where: {
            status: 0,
            id: payload.tokenId,
          },
        });
        if (checkToken) {
          const validatePassword = await validate.changePassword({
            new_password: body["password"],
            confirm_password: body["confirmPassword"],
          });

          if (validatePassword.status) {
            const hashPassword = await password.hash({
              password: `${body["password"]}`.trim(),
            });
            // Update user password
            await UserEntity.update(checkToken.user.id, {
              password: hashPassword,
            });
            // Remove token
            await checkToken.remove();
            // Give feedback
            resolve({
              status: true,
              message: "Your password has been successfully changed.",
            });
          } else {
            // Give feedback
            resolve(validatePassword);
          }
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Something's went wrong try again later.",
            data: null,
          });
        }
      } catch (error) {
        if (error["message"] == "invalid token") {
          // Give feedback
          resolve({
            status: false,
            message: "Something's went wrong try again later.",
            data: null,
          });
        } else {
          // Give feedback
          resolve({
            status: false,
            message: "Something's went wrong try again later.",
            data: null,
          });
        }
      }
    });
  }

  // Forget password
  static postForgetPassword(body: any, req: Request): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check user details
        const checkUser = await UserEntity.findOneBy({
          phoneNumber: body["phoneNumber"],
        });
        if (checkUser) {
          // Create new token ID
          const newToken = new TokenEntity({ user: checkUser });
          await newToken.save();
          // Generate token
          const generateToken = await token.forgetPassword({
            id: checkUser.id,
            tokenId: newToken.id,
          });

          const sendEmail = await send.email(
            body["email"].trim(),
            "RESET PASSWORD",
            `<p>${req.get("origin")}/reset-password/${generateToken}</p>`,
            null
          );

          if (sendEmail.status) {
            // Give feedback
            resolve({
              status: true,
              message: "Password reset link sent to your email.",
              data: null,
            });
          } else {
            // Give feedback
            resolve({ status: false, message: sendEmail.message, data: null });
          }
        } else {
          // Give feedback
          resolve({ status: false, message: "Details not found.", data: null });
        }
      } catch (error) {
        // Give feedback
        reject(error);
      }
    });
  }

  // Disable authentication token
  static disableToken({ id }: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await TokenEntity.update({ id }, { status: 1 });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Check authentication token
  static checkToken({ id }: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        let status: boolean = false;
        const token = await TokenEntity.findOne({
          where: { id, status: 0 },
        });
        typeof token != "undefined" ? (status = true) : "";
        resolve(status);
      } catch (error) {
        reject(error);
      }
    });
  }
}
