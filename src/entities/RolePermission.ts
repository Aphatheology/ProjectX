import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';
import { Permission } from './Permission';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => Role, role => role.rolePermissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Permission, permission => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;
}