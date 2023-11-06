import { CityEntity, OfficeEntity } from "../entities";
import { logger } from "../config";
import { ExcelModel } from "../models";
import { MigrationInterface, QueryRunner } from "typeorm";

export class city1699090354214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      let data = await ExcelModel.read("upload/frontdesk.xlsx");
      data = data.office;
      if (data !== "") {
        for (const item of data) {
          // insert
          const insert = new OfficeEntity({
            head: item.head,
            phoneNumber: item.phoneNumber,
            city: await CityEntity.findOne({
              where: { city: item.city.trim().toLowerCase() },
            }),
            locationAddress: item.locationAddress,
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
