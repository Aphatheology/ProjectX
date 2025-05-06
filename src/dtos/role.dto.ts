export interface CreateRoleDto {
  name: string;
  description?: string;
  permissionIds: [number];
  companyId: number;
};
