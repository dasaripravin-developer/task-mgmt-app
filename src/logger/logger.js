import winston from "winston";

const myFormat = winston.format.printf((info) => {
     let data;
     if (typeof info.message == "object") {
          data = JSON.stringify(info.message, null, 1);
     } else {
          data = info.message;
     }
     return `${info.timestamp} - ${info.level} -${data}`;
});

export const logger = winston.createLogger({
     exitOnError: false,
     level: "info",
     format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), myFormat),
     transports: [
          new winston.transports.Console({}),
          new winston.transports.File({ filename: "./logs/error.log", level: "error", maxsize: 1024 * 1024 * 10 }),
          new winston.transports.File({ filename: "./logs/info.log", level: "info", maxsize: 1024 * 1024 * 10 }),
     ],
});

// export { logger };
