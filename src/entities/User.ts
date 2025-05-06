import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm"
import { Company } from './Company';
import { Role } from './Role';
import { UserTypesEnum } from '../dtos/user.types';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserTypesEnum,
    default: UserTypesEnum.STAFF,
  })
  userType: UserTypesEnum;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  role: Role;

  @ManyToOne(() => Company)
  @JoinColumn({ name: "company_id" })
  company: Company;

  // @ManyToOne(() => Company, (company) => company.users, { nullable: false })
  // @JoinColumn({ name: "company_id" })
  // company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
