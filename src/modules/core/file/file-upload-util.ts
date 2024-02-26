import { Request } from 'express'
import { extname } from 'path'
import ShortUniqueId from 'short-unique-id'

// 短唯一id 生成器
const uid = new ShortUniqueId({ length: 10 })
/**
 * editFileName: 重命名文件
 */
export const editFileName = (req: Request, file: Express.Multer.File, callback) => {
  const name = uid.rnd()
  const fileExtName = extname(`${file.originalname}`)
  callback(null, `${name}${fileExtName}`)
}

/**
 * imageFileFilter: 文件过滤
 */
export const imageFileFilter = (req: Request, file: Express.Multer.File, callback): any => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}
