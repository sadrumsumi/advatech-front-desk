import {
  Entity,
  Column,
  ManyToOne,
  BaseEntity,
  BeforeUpdate,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

import moment = require("moment-timezone");
import { RoleEntity } from "./role_entity";
import { OfficeEntity } from "./office_entity";
import { UserTaskEntity } from "./user_task_entity";
import { TokenEntity } from "./token_entity";

@Entity({ name: "user" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ unique: true, nullable: false })
  password: string;

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

  @ManyToOne((type) => RoleEntity, (role) => role.user, {
    nullable: false,
  })
  role: RoleEntity;

  @ManyToOne((type) => OfficeEntity, (office) => office.user, {
    nullable: false,
  })
  office: OfficeEntity;

  @OneToMany((type) => TokenEntity, (token) => token.user)
  token: TokenEntity[];

  @OneToMany((type) => UserTaskEntity, (user_task) => user_task.user)
  userTask: UserTaskEntity[];

  constructor(data?: UserParameter) {
    super();
    if (data) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.phoneNumber = data.phoneNumber;
      this.password = data.password;
      this.role = data.role;
      this.office = data.office;
    }
  }
}

interface UserParameter {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  role: RoleEntity;
  office: OfficeEntity;
}
