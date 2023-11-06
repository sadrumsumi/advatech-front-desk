import * as bcrypt from "bcryptjs";

/**hash function handler*/
const hash = ({ password }: hash): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      resolve(bcrypt.hashSync(password, salt));
    } catch (error) {
      reject(error);
    }
  });
};

/**comparision function handler*/
const compare = ({ password, hash }: compare): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const bool = bcrypt.compareSync(password, hash);
      if (bool) {
        resolve({ status: true, message: "Look fine." });
      } else {
        resolve({
          status: false,
          message: "You provide wrong informations.",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const password = { hash, compare };

/**hash parameter*/
interface hash {
  password: string;
}

/**comparison parameter*/
interface compare {
  password: string;
  hash: string;
}
