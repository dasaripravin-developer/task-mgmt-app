import { createClient } from "redis";
import { logger } from "../logger/logger.js";
import async from "async";

let redisClient = undefined;
export async function connectRedis() {
   return new Promise(async function (resolve, reject) {
      try {
         if (redisClient) return resolve(redisClient);
         redisClient = await createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
         redisClient.on("error", (err) => {
            logger.error(`service - redis - connectRedis - error - ${err}`);
         });
         redisClient.on("connect", (err) => {
            logger.info(`service - redis - connectRedis - redis connection made`);
            resolve(redisClient);
         });
         await redisClient.connect();
      } catch (err) {
         logger.error(`service - redis - connectRedis - exception - ${err}`);
         reject(err);
      }
   });
}

export async function set(key, field, data) {
   try {
      logger.info(`service - redis - set - key ${key} - field -${field} -  data - ${JSON.stringify(data)}`);
      if (!redisClient) await connectRedis();
      await redisClient.set(`${key}:${field}`, JSON.stringify(data));
      // await redisClient.hSet(key, field, JSON.stringify(data));
      logger.info(`service - redis - set - data saved on ${key} key`);
   } catch (err) {
      logger.error(`service - redis - set - exception - ${err}`);
   }
}

export async function get(key, field) {
   try {
      logger.info(`service - redis - get - key ${key} - field - ${field} `);
      if (!redisClient) await connectRedis();
      let data = await redisClient.get(`${key}:${field}`);
      logger.info(`service - redis - get - key ${key} - field - ${field} - data - ${data} `);
      return JSON.parse(JSON.parse(data));
   } catch (err) {
      logger.error(`service - redis - get - exception - ${err}`);
   }
}

export async function del(key, field) {
   try {
      logger.info(`service - redis - del - key ${key} - field - ${field} `);
      if (!redisClient) await connectRedis();
      // let data = await redisClient.hDel(key, field);
      let data = await redisClient.del(`${key}:${field}`);
      logger.info(`service - redis - del - key ${key} - field - ${field}- deleted`);
      return JSON.parse(data);
   } catch (err) {
      logger.error(`service - redis - del - exception - ${err}`);
   }
}

export async function getKeys(pattern) {
   try {
      if (!redisClient) await connectRedis();
      const keys = await redisClient.keys(pattern);
      logger.info(`service - redis - getKeys - ${JSON.stringify(keys)} -  `);
      return keys;
   } catch (err) {
      logger.error(`service - redis - getKeys - exception - ${err}`);
   }
}

export async function mget(keys) {
   return new Promise(async (resolve, reject) => {
      try {
         logger.info(`service - redis - mget - keys - ${JSON.stringify(keys)}`);
         if (!redisClient) await connectRedis();
         const values = await redisClient.mGet(keys);
         async.map(
            values,
            (val, callback) => {
               val = JSON.parse(val);
               if (typeof val === "string") val = JSON.parse(val);
               callback(null, val);
            },
            (err, result) => {
               resolve(result);
            }
         );
      } catch (err) {
         logger.error(`service - redis - mget exception - ${err}`);
         reject(err);
      }
   });
}

export async function getAllFieldByKey(key) {
   try {
      logger.info(`service - redis - getAllFieldByKey - key ${key} -  `);
      if (!redisClient) await connectRedis();
      let data = await redisClient.hVals(key);
      logger.info(`service - redis - getAllFieldByKey ${key} - data - ${data} `);
      return data.map((task) => JSON.parse(task));
   } catch (err) {
      logger.error(`service - redis - getAllFieldByKey - exception - ${err}`);
   }
}
