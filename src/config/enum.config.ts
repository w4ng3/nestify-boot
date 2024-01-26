/**
 * 环境变量枚举
 */
export enum ConfigEnum {
  DATABASE_URL = 'DATABASE_URL',

  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRATION_TIME = 'JWT_EXPIRATION_TIME',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_RECONNECT = 'REDIS_RECONNECT',
}

/**
 * @description 定义查询类型，以便实现回收站功能
 */
export enum QueryMode {
  /** 包含已软删除和未软删除的数据 */
  ALL = 'all',
  /** 只包含软删除的数据(deleted===1) */
  DEL = 'deleted',
  /** 只包含有效数据（deleted===0） */
  VALID = 'valid',
}
