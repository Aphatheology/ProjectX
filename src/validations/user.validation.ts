import Joi from 'joi';
import { password } from '../utils/customValidation';
import { UserTypesEnum } from '../dtos/user.types';

export const register = {
  body: Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().custom(password),
      fullName: Joi.string().required(),
      companyName: Joi.string().required(),
    }),
};

export const login = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

export const createUser = {
  body: Joi.object({
      email: Joi.string().required().email(),
      fullName: Joi.string().required(),
      roleId: Joi.string().uuid().required(),
    }),
};
