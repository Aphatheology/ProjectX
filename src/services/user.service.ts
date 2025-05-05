import { StatusCodes } from 'http-status-codes';
import ApiError from "../utils/apiError";
import { AppDataSource } from "../dataSource";
import { User } from "../entities/User";

export default class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async getProfile(user: User): Promise<User> {
    const userProfile = await this.userRepository.findOneBy({ id: user.id });

    if (!userProfile) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    return userProfile;
  };

}
