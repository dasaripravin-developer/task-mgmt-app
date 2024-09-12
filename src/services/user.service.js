import { logger } from "../logger/logger.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function userRegister(data) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`services - user - userRegister - ${JSON.stringify(data)}`);
         const user = new UserModel(data);
         await user.save();
         resolve();
      } catch (err) {
         logger.error(`services - user - userRegister - Exception - ${err}`);
         reject(err);
      }
   });
}

export async function userLogin(data) {
   return new Promise(async (resolve, reject) => {
      try {
         const user = await UserModel.findOne({ username: data.username });
         if (!user || !(await user.comparePassword(data.password))) {
            logger.info(`services - user - userLogin - invalid username or password - ${data.username}`);
            return resolve();
         }
         const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
         logger.info(`services - user - userLogin - user exist - ${data.username}`);
         return resolve(token);
      } catch (error) {
         logger.error(`services - user - userLogin - Exception - ${err}`);
         reject(error);
      }
   });
}
