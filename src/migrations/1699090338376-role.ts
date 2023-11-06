import { RoleEntity } from "../entities";
import { logger } from "../config";
import { MigrationInterface, QueryRunner } from "typeorm";
import { ExcelModel } from "../models";

export class role1699090338376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      let data = await ExcelModel.read("upload/frontdesk.xlsx");
      data = data.roles;
      if (data !== "") {
        for (const item of data) {
          // insert
          const insert = new RoleEntity({
            type: item.type.toLowerCase().trim(),
            description: item.description.toLowerCase(),
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
