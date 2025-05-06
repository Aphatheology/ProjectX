import { UserTypesEnum } from './user.types';

export interface RegisterDto {
  user: {
    email: string;
    password: string;
    userType: UserTypesEnum;
    fullName: string;
  };
  company: {
    name: string;
    id?: number;     
  };
}

export interface RegisterSuperAdminDto {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
