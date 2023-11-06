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
  ManyToOne,
} from "typeorm";

import moment = require("moment-timezone");
import { OfficeEntity } from "./office_entity";
import { DeviceEntity } from "./device_entity";

@Entity({ name: "customer" })
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  tradeName: string;

  @Column({ nullable: false })
  companyName: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

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

  @OneToMany((type) => DeviceEntity, (device) => device.customer)
  device: DeviceEntity[];

  @ManyToOne((type) => OfficeEntity, (office) => office.customer, {
    nullable: false,
  })
  office: OfficeEntity;

  constructor(data?: CustomerParameter) {
    super();
    if (data) {
      this.tradeName = data.tradeName;
      this.office = data.office;
      this.companyName = data.companyName;
      this.phoneNumber = data.phoneNumber;
    }
  }
}

interface CustomerParameter {
  tradeName: string;
  office: OfficeEntity;
  companyName: string;
  phoneNumber: string;
}
