import { Request } from 'express'
import { extname } from 'path'

/**
 * editFileName: 重命名文件
 * @tip 当前无法正确处理中文文件名，同名文件会被覆盖，
 * 如有需要请自行处理，也可以使用uuid库生成唯一文件名
 */
export const editFileName = (req: Request, file: Express.Multer.File, callback) => {
  const name = file.originalname.split('.')[0]
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
