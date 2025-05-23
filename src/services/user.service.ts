import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../config/database';
import { CreateUserDto } from '../dtos/user.dto';
import { Role } from '../entities/Role';
import { User } from '../entities/User';
import ApiError from '../utils/apiError';

type SanitizedUser = Omit<User, "password">;

export default class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);

  async getProfile(currentUserId: string): Promise<SanitizedUser> {
    const userProfile = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['role', 'role.company'],
    });
    if (!userProfile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    delete (userProfile as Partial<User>).password;
    return userProfile;
  }

  async createUser(createUserDto: CreateUserDto, currentUserId: string): Promise<SanitizedUser> {
    const { fullName, email, roleId } = createUserDto;

    const superAdmin = await this.userRepository.findOne({
      where: { id: currentUserId, isSuperAdmin: true },
      relations: ['ownedCompanies']
    });

    if (!superAdmin) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Only super admins can create users');
    }

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User with this email already exist');
    }

    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['company']
    });

    if (!role) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Role with id: ${roleId} does not exist`);
    }

    const companyIds = superAdmin.ownedCompanies.map(company => company.id);
    if (!companyIds.includes(role.companyId)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, `Role with id: ${roleId} does not belong to your company`);
    }

    // Implement generate random password
    // const tempPassword = Math.random().toString(36).slice(-8);
    const tempPassword = "Password@123";

    const user = this.userRepository.create({
      fullName,
      email,
      password: tempPassword,
      roleId: role.id,
      isSuperAdmin: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Implement email sending
    console.log(`Temporary password for ${email}: ${tempPassword}`);

    delete (savedUser as Partial<User>).password;
    return savedUser;
  }

}
