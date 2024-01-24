import { FastifyRequest } from 'fastify'

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
