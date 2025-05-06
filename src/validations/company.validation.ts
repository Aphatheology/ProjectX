import Joi from 'joi';

export const createCompany = {
  body: Joi.object({
    name: Joi.string().required()
  }),
};

export const companyId = {
  params: Joi.object().keys({
    companyId: Joi.number().integer().required(),
  }),
};

export const updateCompany = {
  body: Joi.object({
    name: Joi.string().required()
  }),
  params: Joi.object().keys({
    companyId: Joi.number().integer().required(),
  }),
};