import jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';
import ApiError from "../utils/apiError";
import config from '../config/config';
import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";
import { encrypt } from "../utils/helper"
import moment from 'moment';

const userRepository = AppDataSource.getRepository(User);

const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await userRepository.findOneBy({ email });
  return !!user;
};

export const register =async (userBody: Record<string, any>): Promise<{ user: User; accessToken: string }> => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
  }

  userBody.password = await encrypt.encryptPassword(userBody.password);
  
  let user = await userRepository.create(userBody);
  user = await userRepository.save(userBody);

  const payload = {
    id: user.id,
    email: user.email,
    iat: moment().unix(),
    exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
  };

  const accessToken = await encrypt.generateToken(payload);

  return { user, accessToken };
};

export const login = async (userBody: { email: string; password: string }): Promise<{ user: User; accessToken: string }> => {
  const user = await userRepository.findOneBy({ email: userBody.email });

  if (!user || !(await encrypt.comparePassword(userBody.password, user.password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
  }

  const payload = {
    id: user.id,
    email: user.email,
    iat: moment().unix(),
    exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
  };

  const accessToken = await encrypt.generateToken(payload);

  return { user, accessToken };
};

export default class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return !!user;
  };

  async register(userBody: Record<string, any>): Promise<{ user: User; accessToken: string }> {
    if (await this.isEmailTaken(userBody.email)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    userBody.password = await encrypt.encryptPassword(userBody.password);
    
    let user = await this.userRepository.create(userBody);
    user = await this.userRepository.save(userBody);

    const payload = {
      id: user.id,
      email: user.email,
      iat: moment().unix(),
      exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
    };

    const accessToken = await encrypt.generateToken(payload);

    return { user, accessToken };
  };

  async login(userBody: { email: string; password: string }): Promise<{ user: User; accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email: userBody.email });

    if (!user || !(await encrypt.comparePassword(userBody.password, user.password))) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      iat: moment().unix(),
      exp: moment().add(config.jwt.accessTokenExpireInMinute, "minutes").unix(),
    };

    const accessToken = await encrypt.generateToken(payload);

    return { user, accessToken };
  };

}
