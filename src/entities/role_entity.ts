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
import { UserEntity } from "./user_entity";

@Entity({ name: "role" })
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: true })
  type: string;

  @Column({ nullable: false })
  description: string;

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

  // Relationship
  @OneToMany((type) => UserEntity, (user) => user.role)
  user: UserEntity[];

  constructor(data?: RoleParameter) {
    super();
    if (data) {
      this.type = data.type;
      this.description = data.description;
    }
  }
}

interface RoleParameter {
  type: string;
  description: string;
}
