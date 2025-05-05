import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "permission_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
  })
  roles: Role[];
}
