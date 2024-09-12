import { connectRedis } from "../services/redis.service.js";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { logger } from "../logger/logger.js";

const redisClient = await connectRedis();

const rateLimiterRedis = new RateLimiterRedis({
   storeClient: redisClient,
   points: 5,
   duration: 1,
   blockDuration: 0, // Do not block if consumed more than points
   keyPrefix: "rlflx", // must be unique for limiters with different purpose
});

export async function rateLimiter(req, res, next) {
   try {
      logger.info(`middleware - rate limiter - username - ${req.userData.username}`);
      rateLimiterRedis
         .consume(req.userData.username)
         .then((rateLimiterRes) => {
            logger.info(`middleware - rate limiter - username - ${req.userData.username} request consumed`);
            next();
         })
         .catch((rejRes) => {
            if (rejRes instanceof Error) {
               next(rejRes);
            } else {
               logger.error(`middleware - rate limiter - username - ${req.userData.username} rate limit exceed`);
               const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
               res.set("Retry-After", String(secs));
               res.status(429).send("Too Many Requests");
            }
         });
   } catch (err) {
      logger.error(`middleware - rate limiter - username - ${req.userData.username} - exception - ${err}`);
      next(err);
   }
}
