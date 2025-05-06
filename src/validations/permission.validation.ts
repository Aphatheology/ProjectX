import Joi from 'joi';

export const createPermission = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
};

export const getPermissions = {
  query: Joi.object().keys({
    roleId: Joi.number().integer().required(),
  }),
};
