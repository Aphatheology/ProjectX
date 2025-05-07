import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { RolePermission } from './RolePermission';
import { Company } from './Company';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company, company => company.roles)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
  rolePermissions: RolePermission[];
}
