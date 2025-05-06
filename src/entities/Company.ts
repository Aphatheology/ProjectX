import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { User } from "./User";
import { Role } from './Role';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ name: "owner_id" })
  ownerId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Role, (role) => role.company)
  roles: Role[];
}
