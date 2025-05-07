import Joi from 'joi';

export const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    companyId: Joi.string().uuid().optional(),
  })
};

export const updateRole = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
  })
};

export const assignPermissions = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    permissionIds: Joi.array().items(Joi.string().uuid()).required()
  })
};

export const deleteRole = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};

export const deletePermissionFromRole = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};