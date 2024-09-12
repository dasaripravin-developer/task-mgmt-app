import mongoose from "mongoose";
import { logger } from "../logger/logger.js";

export const connectDB = async () => {
   new Promise(async function (resolve, reject) {
      try {
         logger.info(`mongo - connectDB - `);
         await mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.DB_NAME}${process.env.MONGO_QUERY_PARAMETERS}`);
         logger.info(`mongo - connectDB - db connection done`);
         resolve();
      } catch (error) {
         logger.error(`mongo - connectDB - Exception - ${error.message}`);
         reject(error);
      }
   });
};
