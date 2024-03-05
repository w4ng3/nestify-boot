import { ConfigEnum } from '@/config/enum.config'
import { getUidFileName } from '@/modules/core/file/file-upload-util'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OSS = require('ali-oss')

@Injectable()
export class OssService {
  client: OSS
  constructor(private readonly configService: ConfigService) {
    void this.getOssClient()
  }

  // 获取实体 Client
  async getOssClient() {
    const [accessKeyId, accessKeySecret, bucket, region] = await Promise.all<string>([
      this.configService.get(ConfigEnum.ALI_ACCESS_KEY_ID),
      this.configService.get(ConfigEnum.ALI_ACCESS_KEY_SECRET),
      this.configService.get(ConfigEnum.OSS_BUCKET),
      this.configService.get(ConfigEnum.OSS_REGION),
    ])
    if (!accessKeyId || !accessKeySecret || !bucket || !region) {
      throw new Error('阿里云 OSS 配置信息不完整')
    }
    this.client = new OSS({ accessKeyId, accessKeySecret, bucket, region })
  }

  /**
   * @description 上传文件到 oss
   * @param {Express.Multer.File} file 文件
   * @param {string} folder 存储文件夹，默认 [nest]
   * @return {string} 返回图片地址
   */
  async uploadOss(file: Express.Multer.File, folder: string = 'nest'): Promise<string> {
    try {
      const filename = getUidFileName(file.originalname)
      const result: OSS.PutObjectResult = await this.client.put(
        `/${folder}/${filename}`,
        file.buffer,
        {
          headers: {
            // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
            'x-oss-forbid-overwrite': 'true',
          },
        },
      )
      return result.url
    } catch (error) {
      throw new HttpException('图片上传失败' + error, HttpStatus.BAD_REQUEST)
    }
  }
}
