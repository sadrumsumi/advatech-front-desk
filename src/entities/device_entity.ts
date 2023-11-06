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
import { CustomerEntity } from "./customer_entity";
import { OfficeEntity } from "./office_entity";
import { TaskEntity } from "./task_entity";

@Entity({ name: "device" })
export class DeviceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, nullable: false })
  simCardNumber: string;

  @Column({ unique: true, nullable: false })
  serialNumber: string;

  @Column({ nullable: false })
  locationAddress: string;

  @Column({ nullable: false, default: "collected" })
  status: string;

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

  @OneToMany((type) => TaskEntity, (task) => task.device)
  task: TaskEntity[];

  @ManyToOne((type) => CustomerEntity, (customer) => customer.device, {
    nullable: false,
  })
  customer: CustomerEntity;

  @ManyToOne((type) => OfficeEntity, (office) => office.device, {
    nullable: false,
  })
  office: OfficeEntity;

  constructor(data?: DeviceParameter) {
    super();
    if (data) {
      this.customer = data.customer;
      this.office = data.office;
      this.simCardNumber = data.simCardNumber;
      this.serialNumber = data.serialNumber;
      this.locationAddress = data.locationAddress;
    }
  }
}

interface DeviceParameter {
  simCardNumber: string;
  serialNumber: string;
  locationAddress: string;
  customer: CustomerEntity;
  office: OfficeEntity;
}
