import path = require("path");
import * as reader from "xlsx";

export class ExcelModel {
  static async read(dir: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        // Read
        const file = reader.readFile(path.join(__dirname, `${"../../" + dir}`));
        // Sheets
        const sheets = file.SheetNames;

        const data: any = {};
        for (const item of sheets) {
          const sheet = reader.utils.sheet_to_json(file.Sheets[item]);
          data[`${item}`] = sheet;
        }
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
