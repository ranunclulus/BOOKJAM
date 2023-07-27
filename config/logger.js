import winston from "winston";
import WinstonDaily from "winston-daily-rotate-file";
import process from "process";

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`; // 로그 저장 디렉토리

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`; // 날짜 [라벨] 로그레벨 메세지
});

const logger = winston.createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), label({ label: "bookjam backend" }), logFormat),
  transports: [
    new WinstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    new WinstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error",
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
  exceptionHandlers: [
    new WinstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // log level별로 색상 적용하기
        logFormat
      ),
      handleExceptions: true,
    })
  );
}

export default logger;
