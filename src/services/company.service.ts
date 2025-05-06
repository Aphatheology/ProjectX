// import { Repository } from 'typeorm';
// import { AppDataSource } from '../dataSource';
// import { Company } from '../entities/Company';
// import { User } from '../entities/User';
// import ApiError from '../utils/apiError';
// import httpStatus from 'http-status';
// import PermissionService from './permission.service';
// import RoleService from './role.service';

// export default class CompanyService {
//   private companyRepository: Repository<Company>;
//   private userRepository: Repository<User>;
//   private permissionService;
//   private roleService;

//   constructor() {
//     this.companyRepository = AppDataSource.getRepository(Company);
//     this.userRepository = AppDataSource.getRepository(User);
//     this.roleService = new RoleService();
//     this.permissionService = new PermissionService();
//   }

//   async createCompany(name: string, ownerId: number): Promise<Company> {
//     const user = await this.userRepository.findOne({ where: { id: ownerId } });
//     if (!user) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     const company = this.companyRepository.create({ name, ownerId });
//     const savedCompany = await this.companyRepository.save(company);

//     let permission = await this.permissionService.getPermissionByNameExternal('__all_company_permissions__');
//     if (!permission) {
//       permission = await this.permissionService.createPermission({
//         name: '__all_company_permissions__',
//         description: 'This is the default superadmin permission for any company'
//       });
//     }
//     const role = await this.roleService.createRole({
//       name: 'SuperAdmin',
//       description: 'This is the default superadmin role for this company',
//       permissionIds: [permission.id],
//       companyId: company.id,
//     });

//     user.role = role;
//     user.company = company;
//     await this.userRepository.save(user);

//     return savedCompany;
//   }

//   async getCompanyById(id: number): Promise<Company> {
//     const company = await this.companyRepository.findOne({
//       where: { id },
//       relations: ['users', 'roles'],
//     });
//     if (!company) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
//     }
//     return company;
//   }

//   async getCompanyByUserId(userId: number): Promise<Company> {
//     const user = await this.userRepository.findOne({
//       where: { id: userId },
//       relations: ['company'],
//     });
//     if (!user || !user.company) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Company not found for this user');
//     }
//     return user.company;
//   }

//   async updateCompany(id: number, name: string): Promise<Company> {
//     const company = await this.getCompanyById(id);
//     company.name = name;
//     // Object.assign(company, update);
//     return this.companyRepository.save(company);
//   }

//   async deleteCompany(id: number): Promise<Company> {
//     const company = await this.getCompanyById(id);
//     await this.companyRepository.remove(company);
//     return company;
//   }
// }
