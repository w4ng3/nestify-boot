/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

// 生成 crud 模块（包含 module、controller、service、dto 文件）
// 终端运行命令 pnpm gen 或 node src/modules/core/crud/generate.js -m [模块名] -p [prisma model] 
// 例如：pnpm gen -m posts -p Post

const fs = require('fs')
const path = require('path')
const { program } = require('commander')

program
  .option('-m, --moduleName <char>') // 需要生成的模块名
  .option('-p, --prismaSchema <char>') // 需要使用 prisma schema 里的 model

program.parse(process.argv) // 解析命令行参数
const options = program.opts() // 返回一个以键值对形式包含本地选项值的对象
// 获取模块名
const mName = options.moduleName
// moduleName 首字母改大写
const mNameUpper = mName.charAt(0).toUpperCase() + mName.slice(1)
// 使用的 prisma schema 里的 model
const prismaSchemaModel = options.prismaSchema ? options.prismaSchema : mNameUpper
// console.log('options :>> ', options);
/**
 * 生成模板文件
 * @param {string} fileName 文件名
 * @param {string} filePath 文件路径
 * @param {string} content 文件内容
 */
function generateTemplateFile(fileName, filePath, content) {
  const fullPath = path.join(filePath, fileName)
  const dirPath = path.dirname(fullPath)
  // 确保目录存在，如果不存在则创建它
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  // 生成文件
  fs.writeFile(fullPath, content, (err) => {
    if (err) {
      console.error('Failed to generate template file:', err)
    } else {
      console.log('Template file generated successfully:', fullPath)
    }
  })
}

function generateModule() {
  const fileName = `${mName}.module.ts`
  const filePath = `./src/modules/${mName}`
  const content =
    `import { Module } from '@nestjs/common'
import { ${mNameUpper}Service } from './${mName}.service'
import { ${mNameUpper}Controller } from './${mName}.controller'

@Module({
  controllers: [${mNameUpper}Controller],
  providers: [${mNameUpper}Service],
  exports: [${mNameUpper}Service],
})
export class ${mNameUpper}Module {}
`
  generateTemplateFile(fileName, filePath, content)
}

function generateService() {
  const fileName = `${mName}.service.ts`
  const filePath = `./src/modules/${mName}`
  const content =
    `import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { CrudService } from '@/modules/core/crud/crud.service'

@Injectable()
export class ${mNameUpper}Service extends CrudService {
  model: Prisma.ModelName = Prisma.ModelName.${prismaSchemaModel}
  constructor(protected prisma: PrismaService) {
    super(prisma)
  }
}
`
  generateTemplateFile(fileName, filePath, content)
}

function generateController() {
  const fileName = `${mName}.controller.ts`
  const filePath = `./src/modules/${mName}`
  const content =
    `import { Controller, SerializeOptions } from '@nestjs/common'
import { ${mNameUpper}Service } from './${mName}.service'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { CrudController } from '@/modules/core/crud/crud.controller'
import { Crud } from '@/modules/core/crud/crud.decorator'
import { PageQuery${mNameUpper}Dto } from './cats.dto'
// import { Create${mNameUpper}Dto, Update${mNameUpper}Dto } from './${mName}.dto'

@Crud({
  enabled: ['create', 'findOne', 'findAll', 'findPage', 'update', 'delete'],
  dtos: {
    // create: Create${mNameUpper}Dto,
    // update: Update${mNameUpper}Dto,
    query: PageQuery${mNameUpper}Dto,
  },
})
@SerializeOptions({ excludePrefixes: ['deleted'] })
@ApiTags('${mName}')
@ApiBearerAuth()
@Controller('${mName}')
export class ${mNameUpper}Controller extends CrudController {
  constructor(private readonly ${mName}Service: ${mNameUpper}Service) {
    super(${mName}Service)
  }
}
`
  generateTemplateFile(fileName, filePath, content)
}

function generateDto() {
  const fileName = `${mName}.dto.ts`
  const filePath = `./src/modules/${mName}`
  const content =
    `import { paginatedDto } from '@/common/model/paginate'
import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger'

export class Create${mNameUpper}Dto {}

export class Update${mNameUpper}Dto extends PartialType(OmitType(Create${mNameUpper}Dto, [] as const)) {}

/** 分页查询 DTO */
export class PageQuery${mNameUpper}Dto extends IntersectionType(paginatedDto, Update${mNameUpper}Dto) {}
`
  generateTemplateFile(fileName, filePath, content)
}

function main() {
  generateModule()
  generateController()
  generateService()
  generateDto()
}
main()
