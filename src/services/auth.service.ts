import { StatusCodes } from 'http-status-codes';
import { Repository } from 'typeorm';
import { LoginDto, RegisterSuperAdminDto } from '../dtos/auth.dto';
import { Company } from '../entities/Company';
import { Permission } from '../entities/Permission';
import { Role } from '../entities/Role';
import { RolePermission } from '../entities/RolePermission';
import { User } from "../entities/User";
import ApiError from "../utils/apiError";
import { encrypt } from "../utils/helper";
import { AppDataSource } from '../config/database';

type SanitizedUser = Omit<User, "password">;

export default class AuthService {
  private userRepository: Repository<User>;
  private companyRepository: Repository<Company>;
  private roleRepository: Repository<Role>;
  private permissionRepository: Repository<Permission>;
  private rolePermissionRepository: Repository<RolePermission>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.companyRepository = AppDataSource.getRepository(Company);
    this.roleRepository = AppDataSource.getRepository(Role);
    this.permissionRepository = AppDataSource.getRepository(Permission);
    this.rolePermissionRepository = AppDataSource.getRepository(RolePermission);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  };

  async registerSuperAdmin(registerDto: RegisterSuperAdminDto): Promise<{ user: SanitizedUser; accessToken: string }> {
    const { fullName, companyName, email, password: plainPassword } = registerDto;

    if (await this.isEmailTaken(email)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    const user = this.userRepository.create({
      fullName,
      email,
      password: plainPassword,
      isSuperAdmin: true,
    });

    let savedUser = await this.userRepository.save(user);

    const company = this.companyRepository.create({
      name: companyName,
      ownerId: savedUser.id,
    });

    const savedCompany = await this.companyRepository.save(company);

    const adminRole = this.roleRepository.create({
      name: 'SuperAdmin',
      description: 'Administrator with all permissions',
      companyId: savedCompany.id,
    });

    const savedRole = await this.roleRepository.save(adminRole);

    const allPermissions = await this.permissionRepository.find();
    for (const permission of allPermissions) {
      const rolePermission = this.rolePermissionRepository.create({
        roleId: savedRole.id,
        permissionId: permission.id,
      });
      await this.rolePermissionRepository.save(rolePermission);
    }

    savedUser.roleId = savedRole.id;
    savedUser = await this.userRepository.save(savedUser);

    const accessToken = await encrypt.generateToken(savedUser);

    delete (savedUser as Partial<User>).password;
    return { user: savedUser, accessToken };
  }

  async login(loginDto: LoginDto): Promise<{ user: SanitizedUser; accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
    });

    if (!user || !(await user.validatePassword(password))) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }

    const accessToken = await encrypt.generateToken(user);

    delete (user as Partial<User>).password;
    return { user, accessToken };
  };

}
