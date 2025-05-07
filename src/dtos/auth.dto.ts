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
