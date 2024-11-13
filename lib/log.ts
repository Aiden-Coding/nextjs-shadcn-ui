// import winston from "winston";

// // 创建一个 logger 实例
// export const logger = winston.createLogger({
//   level: "info", // 日志级别
//   format: winston.format.combine(
//     winston.format.timestamp(), // 添加时间戳
//     winston.format.json() // 以 JSON 格式输出
//   ),
//   transports: [
//     // 输出到控制台
//     new winston.transports.Console({
//       format: winston.format.simple(), // 控制台输出格式
//     }),
//     // 输出到文件
//     // new winston.transports.File({ filename: "error.log", level: "error" }), // 仅记录错误级别的日志
//     // new winston.transports.File({ filename: "combined.log" }), // 记录所有级别的日志
//   ],
// });

// // 示例日志记录
// logger.info("This is an info level log");
// logger.warn("This is a warning");
// logger.error("This is an error");
