import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany
} from "typeorm";
import { Permission } from "./Permission";

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission, (perm) => perm.roles)
  permissions: Permission[];
}
