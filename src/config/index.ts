export const Developer = 'wang dong'
/**
 * @description 一些自定义的元数据键，用于装饰器中设置元数据
 * @example @SetMetadata(ALLOW_GUEST, true)
 */
export const ALLOW_GUEST = 'allowGuest'
export const CRUD_OPTIONS = 'crudOptions'
export const CRUD_INCLUDE = 'crudInclude'
export const PERMISSION_KEY = 'permission'
export const SKIP_INTERCEPTOR = 'skipInterceptor'

/**
 * @description 环境变量
 */
/** 全局路由前缀 */
export const GLOBAL_PREFIX = 'api'
/** 静态文件目录：定义在后端文件外层 */
export const STATIC_DIR = '../nest-static'
/** 请求静态文件所需的前缀 */
export const STATIC_PREFIX = '/assets'
/** 图片上传目录 */
export const UPLOAD_IMG_DIR = '/upload/imgs'
/** 邮箱服务配置 */
export const EMAIL_CONFIG = {
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: 'xxx@qq.com', // 发送方邮箱
    pass: '*****', // 授权码
  },
}
