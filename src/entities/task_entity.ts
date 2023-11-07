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
import { UserTaskEntity } from "./user_task_entity";
import { DeviceEntity } from "./device_entity";
import { OfficeEntity } from "./office_entity";
import { UserEntity } from "./user_entity";

@Entity({ name: "task" })
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  reporterName: string;

  @Column({ nullable: false })
  reporterPhoneNumber: string;

  @Column({ type: "text", default: null })
  accessories: string;

  @Column({ type: "text", nullable: false })
  reportedIssue: string;

  @Column({ nullable: false })
  reportedDate: string;

  @Column({ nullable: false })
  timeIn: string;

  @Column({ nullable: false })
  timeOut: string;

  @Column({ default: "not collected" })
  status: string;

  @Column({ nullable: false })
  month: number;

  @Column({ nullable: false })
  year: number;

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

  @ManyToOne((type) => OfficeEntity, (office) => office.task, {
    nullable: false,
  })
  office: OfficeEntity;

  @ManyToOne((type) => DeviceEntity, (device) => device.task, {
    nullable: false,
  })
  device: DeviceEntity;

  @ManyToOne((type) => UserEntity, (user) => user.task, {
    nullable: false,
  })
  user: UserEntity;

  constructor(data?: TaskParameter) {
    super();
    if (data) {
      this.reporterName = data.reporterName;
      this.reporterPhoneNumber = data.reporterPhoneNumber;
      this.reportedIssue = data.reportedIssue;
      this.reportedDate = data.reportedDate;
      this.timeIn = data.timeIn;
      this.month = data.month;
      this.timeOut = data.timeOut;
      this.year = data.year;
      this.accessories = data.accessories;
      this.office = data.office;
      this.device = data.device;
      this.user = data.user;
    }
  }
}

interface TaskParameter {
  reporterName: string;
  reporterPhoneNumber: string;
  reportedIssue: string;
  reportedDate: string;
  timeIn: string;
  year: number;
  accessories: string;
  timeOut: string;
  month: number;
  user: UserEntity;
  office: OfficeEntity;
  device: DeviceEntity;
}
