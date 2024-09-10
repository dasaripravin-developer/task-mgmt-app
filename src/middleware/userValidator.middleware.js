import { register, login } from "../schema/user.schema.js";

export async function registerValidator(request, response, next) {
     const { error } = register.validate(request.body);
     if (error) return response.status(400).send(error.message);
     else next();
}

export async function loginValidator(request, response, next) {
     const { error } = login.validate(request.body);
     if (error) return response.status(400).send(error.message);
     else next();
}
