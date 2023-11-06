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
import { TaskEntity } from "./task_entity";
import { DeviceEntity } from "./device_entity";
import { CustomerEntity } from "./customer_entity";
import { CityEntity } from "./city_entity";
import { UserEntity } from "./user_entity";

@Entity({ name: "office" })
export class OfficeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  head: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  locationAddress: string;

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

  @OneToMany((type) => TaskEntity, (task) => task.office)
  task: TaskEntity[];

  @OneToMany((type) => DeviceEntity, (device) => device.office)
  device: DeviceEntity[];

  @OneToMany((type) => UserEntity, (user) => user.office)
  user: UserEntity[];

  @OneToMany((type) => CustomerEntity, (customer) => customer.office)
  customer: CustomerEntity[];

  @ManyToOne((type) => CityEntity, (city) => city.office, {
    nullable: false,
  })
  city: CityEntity;

  constructor(data?: OfficeParameter) {
    super();
    if (data) {
      this.head = data.head;
      this.phoneNumber = data.phoneNumber;
      this.city = data.city;
      this.locationAddress = data.locationAddress;
    }
  }
}

interface OfficeParameter {
  head: string;
  phoneNumber: string;
  city: CityEntity;
  locationAddress: string;
}
