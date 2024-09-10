import mongoose from "mongoose";
import { logger } from "../logger/logger.js";

export const connectDB = async () => {
     new Promise(async function (resolve, reject) {
          try {
               logger.info(`mongo - connectDB - `);
               await mongoose.connect(process.env.MONGO_URL);
               logger.info(`mongo - connectDB - db connection done`);
               resolve();
          } catch (error) {
               logger.error(`mongo - connectDB - Exception - ${error.message}`);
               reject(error);
          }
     });
};

// module.exports = connectDB;
