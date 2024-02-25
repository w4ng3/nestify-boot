import { FastifyRequest } from 'fastify'

interface FileMapper {
  file: Express.Multer.File
  req: FastifyRequest
}

interface FilesMapper {
  files: Express.Multer.File[]
  req: FastifyRequest
}

// file (single)
export const fileMapper = ({ file, req }: FileMapper) => {
  const image_url = `${req.protocol}://${req.headers.host}/${file.path}`
  return {
    originalname: file.originalname,
    filename: file.filename,
    image_url,
  }
}

// files (multiple)
export const filesMapper = ({ files, req }: FilesMapper) => {
  return files.map((file) => {
    const image_url = `${req.protocol}://${req.headers.host}/${file.path}`
    return {
      originalname: file.originalname,
      filename: file.filename,
      image_url,
    }
  })
}
