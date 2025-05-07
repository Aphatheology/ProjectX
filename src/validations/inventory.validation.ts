import Joi from "joi";

export const createInventoryItem = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(0).default(0),
    sku: Joi.string().required(),
    companyId: Joi.string().uuid().optional()
  })
};

export const updateInventoryItem = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(null, ''),
    price: Joi.number().min(0).optional(),
    quantity: Joi.number().integer().min(0).optional(),
    sku: Joi.string().optional(),
    companyId: Joi.string().uuid().optional()
  })
};

export const updateInventoryQuantity = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    quantity: Joi.number().integer().required()
  })
};

export const getInventoryById = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required()
  })
};