import * as env from "dotenv";
import { logger } from "../config";
import * as nodemailer from "nodemailer";

env.config();

export const email = (
  to: string,
  subject: string,
  html?: string,
  attachments?: EmailAttachments[]
): Promise<any> => {
  return new Promise((resolve, reject) => {
    var smtpConfig = {
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASSWORD,
      },
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(smtpConfig);

    // send mail with defined transport object
    transporter.sendMail(
      {
        to,
        html,
        subject,
        attachments: attachments,
        from: process.env.EMAIL_SENDER,
      },
      function (error, info) {
        if (error) {
          logger.error(error);
          resolve({
            status: false,
            message: "Somethings went wrong try again later.",
          });
        } else {
          resolve({
            status: true,
            message: "Email sent successfully.",
          });
        }
      }
    );
  });
};

interface EmailAttachments {
  content: Buffer;
  filename: string;
  contentType: string; //"application/pdf";
}

export const send = { email };
