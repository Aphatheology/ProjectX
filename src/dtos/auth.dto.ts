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

export interface LoginDto {
  email: string;
  password: string;
}
