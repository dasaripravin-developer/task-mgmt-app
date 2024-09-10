import jwt from "jsonwebtoken";
import { logger } from "../logger/logger.js";

export async function authMiddleware(request, response, next) {
     try {
          const token = request.headers?.authorization?.split(" ")[1];
          if (!token) return response.status(401).json({ message: "Token not provided" });
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          logger.info(`middleware - authorization - decoded - ${decoded}`);
          request.userData = decoded;
          next();
     } catch (err) {
          logger.error(`middleware - authorization - exception - ${err.message}`);
          response.status(401).json({ message: err.message });
     }
}
