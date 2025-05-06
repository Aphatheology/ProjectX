import Joi, { number } from 'joi';

export const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    permissionIds: Joi.array()
      .items(Joi.number().integer().required())
      .required(),
  }),
  params: Joi.object().keys({
    companyId: Joi.number().integer().required(),
  }),
};

export const getRoles = {
  params: Joi.object().keys({
    companyId: Joi.number().integer().required(),
  }),
};

export const addPermissionsToRole = {
  params: Joi.object().keys({
    roleId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    permissionIds: Joi.array()
      .items(Joi.number().integer().required())
      .required(),
  }),
};
