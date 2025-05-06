import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany,
  Index,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { Permission } from "./Permission";
import { Company } from './Company';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Company, (company) => company.roles, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToMany(() => Permission, (perm) => perm.roles)
  permissions: Permission[];

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];
}
