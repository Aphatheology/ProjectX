import Joi from 'joi';

export const createPermission = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
  })
};

export const updatePermission = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
  })
};