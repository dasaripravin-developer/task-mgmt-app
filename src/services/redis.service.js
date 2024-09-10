import { createClient } from "redis";
import { logger } from "../logger/logger.js";

let redisClient = undefined;
export async function connectRedis() {
     return new Promise(async function (resolve, reject) {
          try {
               redisClient = await createClient({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });
               redisClient.on("error", (err) => {
                    logger.error(`service - redis - connectRedis - error - ${err}`);
               });
               redisClient.on("connect", (err) => {
                    logger.info(`service - redis - connectRedis - redis connection made`);
                    resolve();
               });
               await redisClient.connect();
          } catch (err) {
               logger.error(`service - redis - connectRedis - exception - ${err}`);
               reject(err);
          }
     });
}

export async function hset(key, field, data) {
     try {
          logger.info(`service - redis - hset - key ${key} - field -${field} -  data - ${JSON.stringify(data)}`);
          if (!redisClient) await connectRedis();
          await redisClient.hSet(key, field, JSON.stringify(data));
          logger.info(`service - redis - hset - data saved on ${key} key`);
     } catch (err) {
          logger.error(`service - redis - hset - exception - ${err}`);
     }
}

export async function hget(key, field) {
     try {
          logger.info(`service - redis - hget - key ${key} - field - ${field} `);
          if (!redisClient) await connectRedis();
          let data = await redisClient.hGet(key, field);
          logger.info(`service - redis - hget - key ${key} - field - ${field} - data - ${data} `);
          return JSON.parse(data);
     } catch (err) {
          logger.error(`service - redis - hget - exception - ${err}`);
     }
}

export async function hdel(key, field) {
     try {
          logger.info(`service - redis - hdel - key ${key} - field - ${field} `);
          if (!redisClient) await connectRedis();
          let data = await redisClient.hDel(key, field);
          logger.info(`service - redis - hdel - key ${key} - field - ${field}- deleted`);
          return JSON.parse(data);
     } catch (err) {
          logger.error(`service - redis - hdel - exception - ${err}`);
     }
}

export async function getAllFieldByKey(key) {
     try {
          logger.info(`service - redis - getAllFieldByKey - key ${key} -  `);
          if (!redisClient) await connectRedis();
          let data = await redisClient.hGetAll(key);
          logger.info(`service - redis - get - getAllFieldByKey ${key} - data - ${data} `);
          return JSON.parse(data);
     } catch (err) {
          logger.error(`service - redis - getAllFieldByKey - exception - ${err}`);
     }
}
