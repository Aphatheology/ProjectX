import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';
import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { encrypt } from '../utils/helper';

type SanitizedUser = Omit<User, "password">;

export default class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private roleRepository = AppDataSource.getRepository(Role);

  async getProfile(user: User): Promise<SanitizedUser> {
    const userProfile = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role', 'company'],
    });
    if (!userProfile) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    const { password, ...sanitized } = userProfile;
    return sanitized;
  }

  async createUser(
    data: { fullName: string; email: string; roleName?: string },
    companyId: number
  ): Promise<SanitizedUser> {
    const { fullName, email, roleName } = data;
    if (await this.userRepository.findOneBy({ email })) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already in use');
    }

    const role = await this.roleRepository.findOne({
      where: {
        name: roleName ?? 'user',
        company: { id: companyId },
      },
    });
    if (!role) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Role not found');
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await encrypt.encryptPassword(tempPassword);

    const user = this.userRepository.create({
      fullName,
      email,
      password: hashed,
      role,
      company: { id: companyId } as any,
    });
    const savedUser = await this.userRepository.save(user);
    (savedUser as any).temporaryPassword = tempPassword;
    return savedUser;
  }

  async listUsers(companyId: number): Promise<SanitizedUser[]> {
    return this.userRepository.find({
      where: { company: { id: companyId } },
      relations: ['role'],
    });
  }

  async getUserById(userId: number): Promise<SanitizedUser> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'company'],
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    const { password, ...sanitized } = user;
    return sanitized;
  }

  async updateUser(userId: number, update: Partial<User>): Promise<SanitizedUser> {
    const user = await this.getUserById(userId);
    Object.assign(user, update);
    return this.userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<SanitizedUser> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'company'],
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    await this.userRepository.remove(user);
    return user;
  }
}
