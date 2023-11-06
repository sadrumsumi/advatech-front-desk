import {
  Entity,
  ManyToOne,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

import moment = require("moment-timezone");
import { TaskEntity } from "./task_entity";
import { UserEntity } from "./user_entity";

@Entity({ name: "user_task" })
export class UserTaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: "not collected" })
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

  @ManyToOne((type) => UserEntity, (user) => user.userTask, {
    nullable: false,
  })
  user: UserEntity;

  @ManyToOne((type) => TaskEntity, (task) => task.userTask, {
    nullable: false,
  })
  task: TaskEntity;

  constructor(data?: UserTaskParameter) {
    super();
    if (data) {
      this.user = data.user;
      this.task = data.task;
    }
  }
}

interface UserTaskParameter {
  user: UserEntity;
  task: TaskEntity;
}
