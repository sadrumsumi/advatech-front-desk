import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import moment = require("moment-timezone");
import { UserEntity } from "./user_entity";

@Entity({ name: "token" })
export class TokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 }) // 0: active, 1: deactived
  status: number;

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

  @ManyToOne((type) => UserEntity, (user) => user.token, { nullable: false })
  user: UserEntity;

  constructor(data?: TokenParameter) {
    super();
    if (data) {
      this.user = data.user;
    }
  }
}

interface TokenParameter {
  user: UserEntity;
}
