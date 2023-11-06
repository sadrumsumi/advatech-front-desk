import {
  Entity,
  Column,
  OneToMany,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import moment = require("moment-timezone");
import { OfficeEntity } from "./office_entity";

@Entity({ name: "city" })
export class CityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  city: string;

  // Date
  @CreateDateColumn({ type: "timestamp" })
  createdAt: string;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: string;

  @BeforeInsert()
  updateDateCreation() {
    this.createdAt = moment(new Date())
      .tz("Africa/Dar_es_Salaam")
      .format("yyyy-MM-DDTHH:mm:ss.SSSSSSSZ");
  }

  @BeforeUpdate()
  updateDateUpdate() {
    this.updatedAt = moment(new Date())
      .tz("Africa/Dar_es_Salaam")
      .format("yyyy-MM-DDTHH:mm:ss.SSSSSSSZ");
  }

  @OneToMany((type) => OfficeEntity, (office) => office.city)
  office: OfficeEntity[];

  constructor(data?: CityParameter) {
    super();
    if (data) {
      this.city = data.city;
    }
  }
}

interface CityParameter {
  city: string;
}
