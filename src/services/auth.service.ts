import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';
import ApiError from "../utils/apiError";
import config from '../config/config';
import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";
import { encrypt } from "../utils/helper"
import moment from 'moment';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { Company } from '../entities/Company';
import CompanyService from './company.service';
import { UserTypesEnum } from '../dtos/user.types';
import RoleService from './role.service';
import { Role } from '../entities/Role';

type SanitizedUser = Omit<User, "password">;

export default class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private companyService = new CompanyService();
  private roleService = new RoleService();

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  };

  async register(registerDto: RegisterDto): Promise<{ user: SanitizedUser; company?: Company; accessToken: string }> {
    if (await this.isEmailTaken(registerDto.user.email)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    registerDto.user.password = await encrypt.encryptPassword(registerDto.user.password);

    let user = await this.userRepository.create(registerDto.user);
    user = await this.userRepository.save(user);

    const payload = {
      id: user.id,
      email: user.email,
      iat: moment().unix(),
      exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
    };

    const accessToken = await encrypt.generateToken(payload);
    if (registerDto.user.userType == UserTypesEnum.COMPANY) {
      const company = await this.companyService.createCompany(registerDto.company.name, user.id);
      return { user, company, accessToken };
    }

    const { password, ...sanitized } = user;
    console.log(user, sanitized)
    return { user: sanitized, accessToken };
  };

  async login(userBody: LoginDto): Promise<{ user: SanitizedUser; role?: Role, company?: any, accessToken: string }> {
    const user = await this.userRepository.findOne( { where: { email: userBody.email }, relations: ['role']});

    if (!user || !(await encrypt.comparePassword(userBody.password, user!.password))) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }

    let company;
    const role = user.role ? user.role : undefined;

    if (user.userType === UserTypesEnum.COMPANY) {
      company = await this.companyService.getCompanyByUserId(user.id);
    } else if (user.userType === UserTypesEnum.STAFF) {
      company = user.role ? await this.roleService.getCompanyByRoleId(user.role.id) : undefined;
    }

    const payload = {
      id: user.id,
      email: user.email,
      iat: moment().unix(),
      exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
    };

    const accessToken = await encrypt.generateToken(payload);

    const { password, ...sanitized } = user;

    return { user: sanitized, role, company, accessToken };
  };

}
