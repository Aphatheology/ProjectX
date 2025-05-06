import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Role } from './Role';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User, user => user.ownedCompanies)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => Role, role => role.company)
  roles: Role[];
}