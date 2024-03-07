/**
 * 环境变量枚举
 */
export enum ConfigEnum {
  DATABASE_URL = 'DATABASE_URL',
  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRATION_TIME = 'JWT_EXPIRATION_TIME',
  // Redis
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_URL = 'REDIS_URL',
  // 阿里云
  ALI_ACCESS_KEY_ID = 'ALI_ACCESS_KEY_ID',
  ALI_ACCESS_KEY_SECRET = 'ALI_ACCESS_KEY_SECRET',
  OSS_BUCKET = 'OSS_BUCKET',
  OSS_REGION = 'OSS_REGION',
  SMS_SignName = 'Sms_SignName',
  SMS_TemplateCode = 'Sms_TemplateCode',
  // 邮箱
  EMAIL_HOST = 'EMAIL_HOST',
  EMAIL_PORT = 'EMAIL_PORT',
  EMAIL_USER = 'EMAIL_USER',
  EMAIL_PASS = 'EMAIL_PASS',
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

/**
 * @description 定义排序枚举
 */
export enum OrderType {
  /** @description: 按条件升序 */
  ASC = 'asc',
  /** @description: 按条件倒序 */
  DESC = 'desc',
}

/**
 * @description 定义权限枚举, 都用二进制表示，但数据库里存的是十进制；
 * 以利用二进制的“位”来控制权限，一个“位”代表一个权限，位上为1代表用该权限，为0代表没有这个权限；
 * 用二进制的”或（｜）”来给角色添加权限，利用二进制的“与（&）”操作来验证是否拥有某个权限；
 * 删除权限则用二进制的“异或（^）”操作来删除权限；
 *
 * @tips JS按位操作符将其操作数当作 32 位的比特序列（由 0 和 1 组成）操作，所以最多只能有32个权限位
 * 如果想要突破限制，可以使用BigInt类型，或者使用第三方库，如bitwise.js
 * 或者引入权限空间，将权限分为多个空间（按字符串逗号分隔），每个空间32位
 */
export enum PermissionsEnum {
  /** 普通用户: 0 */
  USER = 0b0,
  /** 超级管理员: 1 */
  SUPER_ADMIN = 0b1,
  /** 管理员: 2 */
  ADMIN = 0b10,
  /** VIP用户: 4 */
  VIP = 0b100,
  /** 测试用户: 8 */
  TESTER = 0b1000,
}
