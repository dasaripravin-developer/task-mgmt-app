import Joi from "joi";

export const register = Joi.object({
     firstName: Joi.string().min(1).max(10).required(),
     lastName: Joi.string().min(1).max(10).required(),
     username: Joi.string().min(2).max(15).required(),
     password: Joi.string().min(8).max(16).required(),
});

export const login = Joi.object({
     username: Joi.string().required(),
     password: Joi.string().required(),
});

