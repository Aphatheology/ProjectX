import Joi from 'joi';
import { password } from '../utils/customValidation';
import { UserTypesEnum } from '../dtos/user.types';

export const register = {
  body: Joi.object({
    user: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      fullName: Joi.string().required(),
      userType: Joi.string().valid(...Object.values(UserTypesEnum)).required(),
    }),
    company: Joi.object({
      name: Joi.string().required(),
    }).when('user.userType', {
      is: UserTypesEnum.COMPANY,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  }),
};

export const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};
