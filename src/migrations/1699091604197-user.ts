import { logger } from "../config";
import { OfficeEntity, RoleEntity } from "../entities";
import { UserEntity } from "../entities";
import { ExcelModel } from "../models";
import { password } from "../utils";
import { MigrationInterface, QueryRunner } from "typeorm";

export class user1699091604197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      let data = await ExcelModel.read("upload/frontdesk.xlsx");
      data = data.users;

      if (data !== "") {
        for (const item of data) {
          // insert
          const hasPassword = await password.hash({
            password: `${item["password"]}`.trim(),
          });

          const user = new UserEntity({
            firstName: item["firstName"],
            lastName: item["lastName"],
            phoneNumber: item["phoneNumber"],
            password: hasPassword,
            office: await OfficeEntity.findOne({ where: { id: 1 } }),
            role: await RoleEntity.findOne({
              where: { type: item.role.toLowerCase().trim() },
            }),
          });
          // save user
          await user.save();
        }
        logger.info("==========x <(v)> x==========");
      }
    } catch (error) {
      logger.error(error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
