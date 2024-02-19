import { FastifyRequest } from 'fastify'
import * as bcrypt from 'bcrypt'

/**
 * @description 获取请求的主要信息，用于打印日志
 */
export const getReqMainInfo: (req: FastifyRequest) => string = (req) => {
  const { query, headers, url, method, body, socket } = req

  // 获取 IP
  const xRealIp = headers['X-Real-IP']
  const xForwardedFor = headers['X-Forwarded-For']
  const { ip: cIp } = req
  const { remoteAddress } = socket || {}
  const ip = xRealIp || xForwardedFor || cIp || remoteAddress

  return JSON.stringify({ url, host: headers.host, ip, method, query, body })
}

/**
 * @description 加密明文密码
 * @param password 明文密码
 * @param salt 用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用,推荐 10
 */
export const encrypt = (password: string, salt: string | number) => {
  return bcrypt.hashSync(password, salt || 10)
}

/**
 * @description 验证密码
 * @param password 明文密码
 * @param hashed 加密后的密码, 从数据库中查询出来的
 */
export const decrypt = (password: string, hashed: string) => {
  return bcrypt.compareSync(password, hashed)
}
