import { logger } from "../logger/logger.js";
import { userRegister, userLogin } from "../services/user.service.js";

export async function register(request, response) {
     try {
          logger.info(`controller - user - register - `);
          await userRegister(request.body);
          response.status(200).json({ message: "User registered successfully" });
     } catch (error) {
          logger.error(`controller - user - register - Exception - ${error}`);
          response.status(500).json({ message: error.message });
     }
}

export async function login(request, response) {
     try {
          logger.info(`controller - user - login - `);
          const token = await userLogin(request.body);
          if (token) response.status(200).json({ message: "user login success", token });
          else response.status(200).json({ message: "Invalid username or password" });
     } catch (err) {
          logger.error(`controller - user - login - Exception - ${error}`);
          response.status(500).json({ message: err.message });
     }
}
