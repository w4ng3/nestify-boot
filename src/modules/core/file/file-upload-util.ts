import { HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions'
import { Request } from 'express'
import { extname } from 'path'
import ShortUniqueId from 'short-unique-id'

// 短唯一id 生成器
const uid = new ShortUniqueId({ length: 10 })
/**
 * getUidFileName: 生成唯一文件名
 */
export const getUidFileName = (originalname: string) => {
  const fileExtName = extname(originalname)
  return uid.rnd() + fileExtName
}
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
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
    return callback(new HttpException('只支持图片格式的文件', HttpStatus.BAD_REQUEST), false)
  }
  callback(null, true)
}
