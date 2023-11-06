import * as Joi from "joi";

/**signin validation handler function*/
const signup = (body: signupParameter): Promise<any> => {
  return new Promise((resolve, reject) => {
    const schema = Joi.object({
      last_name: Joi.string().required(),
      first_name: Joi.string().required(),
      customer_id: Joi.string().required(),
      phone_number: Joi.string()
        .required()
        .pattern(new RegExp("^[0-9]{12,12}$")),
      email_address: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{5,30}$")),
      confirm_password: Joi.string().required().valid(Joi.ref("password")),
    });
    const { error } = schema.validate(body);
    if (error) {
      resolve({ status: false, message: "Invalid input." });
    } else {
      resolve({ status: true, message: "look fine." });
    }
  });
};

/**signup validation handler function*/
const signin = (body: signinParameter): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string()
          .required()
          .pattern(new RegExp("^[a-zA-Z0-9@#]{5,30}$")),
      });
      const { error } = schema.validate(body);
      if (error) {
        resolve({ status: false, message: "Invalid input." });
      } else {
        resolve({ status: true, message: "Look fine." });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const changePassword = (body: PasswordParameter): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const schema = Joi.object({
        new_password: Joi.string()
          .required()
          .pattern(new RegExp("^[a-zA-Z0-9 ]{5,30}$")),
        confirm_password: Joi.string()
          .required()
          .valid(Joi.ref("new_password")),
      });
      const { error } = schema.validate(body);
      if (error) {
        resolve({
          status: false,
          message:
            "Provide a matching password with a min of 5 character long.",
        });
      } else {
        resolve({ status: true, message: "Look fine." });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateProfile = ({ body }: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone_number: Joi.string()
          .required()
          .pattern(new RegExp("^[0-9]{10,10}$")),
        email_address: Joi.string()
          .required()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
        user_id: Joi.number().required(),

        old_email: Joi.string()
          .required()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
        old_phone: Joi.string()
          .required()
          .pattern(new RegExp("^[0-9]{10,10}$")),
      });

      const { error } = schema.validate(body);
      if (error) {
        resolve({ status: false, message: "Invalid input." });
      } else {
        resolve({ status: true, message: "look fine." });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const validate = { signin, changePassword, updateProfile };

/**signin parameter*/
interface signinParameter {
  password: string;
  username: string;
}

/**signup parameter*/
interface signupParameter {
  password: string;
  last_name: string;
  first_name: string;
  phone_number: string;
  email_address: string;
  confirm_password: string;
}

/**change password parameter*/
interface PasswordParameter {
  new_password: string;
  confirm_password: string;
}
