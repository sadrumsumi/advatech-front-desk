import { logger } from "../config";
import { CityEntity } from "../entities";
import { ExcelModel } from "../models";
import { MigrationInterface, QueryRunner } from "typeorm";

export class city1699090348338 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      let data = await ExcelModel.read("upload/frontdesk.xlsx");
      data = data.cities;
      if (data !== "") {
        for (const item of data) {
          // insert
          const insert = new CityEntity({
            city: item.city.trim().toLowerCase(),
          });
          await insert.save();
        }
        logger.info("==========x <(v)> x==========");
      }
    } catch (error) {
      logger.error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
