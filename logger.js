var winston = require("winston");
require("winston-daily-rotate-file");
var { combine, timestamp, label, printf } =winston.format;
var myFormat = printf(({ level, message, timestamp }) => {
  level=level.toUpperCase()
  return `[${timestamp}] ${level}: ${message}`;
});
var Format = combine(
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
}),
  myFormat
);
var transport = new winston.transports.DailyRotateFile({
    filename: "./logs/log_%DATE%.log",
    datePattern: "YYYYMMDD",
    maxFiles: "14",
    level:"debug"
  });

var logger =  winston.createLogger({
    format: Format,
    defaultMeta: { service: "user-service" },
    transports: [
      transport
    ]
  });

module.exports=logger;