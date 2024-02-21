import * as winston from 'winston'
import 'winston-daily-rotate-file'
import { LoggerOptions } from 'winston'
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'
/**
 * @description: winston 日志配置
 * @tips: logger 实例具有不同的 logger 方法，每个方法采用不同的参数。
 * https://www.npmjs.com/package/nest-winston?activeTab=readme#logger-methods
 * debug(message: any, context?: string)
 * log(message: any, context?: string)
 * error(message: any, stack?: string, context?: string)
 * verbose(message: any, context?: string)
 * warn(message: any, context?: string)
 */
export const WinstonOptionsConfig: LoggerOptions = {
  // pid是 process identifier 的缩写，即进程标识符
  defaultMeta: { pid: process.pid },
  exitOnError: false, // 未捕获的异常不会导致进程退出
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.ms(),
    nestWinstonModuleUtilities.format.nestLike('Winston', {
      colors: true,
      prettyPrint: true,
    }),
  ),
  transports: [
    // 控制台日志，不要在生产环境中使用控制台日志记录器，打包时请注释掉
    new winston.transports.Console(),
    //日志文件, 按日期切割日志文件
    new winston.transports.DailyRotateFile({
      level: 'info', // info级别会记录 info, warn, error 三个级别的日志
      dirname: 'logs', // 日志保存的目录
      filename: '%DATE%-info.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
      datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
      zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
      maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
      maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
      format: winston.format.uncolorize(), // 去掉log文件颜色，vscode打开log不识别
    }),
    // 错误日志, 记录 error 级别的日志,
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: '%DATE%-error.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
      datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
      zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
      maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
      maxFiles: '14d', // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
      format: winston.format.uncolorize(),
    }),
  ],
}
