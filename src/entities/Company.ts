import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany
} from "typeorm";
import { User } from "./User";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  // @OneToMany(() => User, (user) => user.company)
  // users: User[];
}
