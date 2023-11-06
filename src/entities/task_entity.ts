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

@Entity({ name: "task" })
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  reporterName: string;

  @Column({ nullable: false })
  reporterPhoneNumber: string;

  @Column({ type: "text", nullable: false })
  reportedIssue: string;

  @Column({ nullable: false })
  reportedDate: string;

  @Column({ nullable: false })
  timeIn: string;

  @Column({ nullable: false })
  timeOut: string;

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

  @OneToMany((type) => UserTaskEntity, (user_task) => user_task.task)
  userTask: UserTaskEntity;

  constructor(data?: TaskParameter) {
    super();
    if (data) {
      this.reporterName = data.reporterName;
      this.reporterPhoneNumber = data.reporterPhoneNumber;
      this.reportedIssue = data.reportedIssue;
      this.reportedDate = data.reportedDate;
      this.timeIn = data.timeIn;
      this.timeOut = data.timeOut;
      this.office = data.office;
      this.device = data.device;
    }
  }
}

interface TaskParameter {
  reporterName: string;
  reporterPhoneNumber: string;
  reportedIssue: string;
  reportedDate: string;
  timeIn: string;
  timeOut: string;
  office: OfficeEntity;
  device: DeviceEntity;
}
