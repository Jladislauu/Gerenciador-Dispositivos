import Joi from "joi";

export const createDeviceSchema = Joi.object({
  name: Joi.string().max(100).required(),
  mac: Joi.string().max(32).required(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("ATIVO", "INATIVO").required(),
});