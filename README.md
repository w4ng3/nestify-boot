<p align="center">
  <a href="https://nest.nodejs.cn/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
<H1 align="center">Nest 最佳实践</H1>

## Description
**主要技术栈**： [Nest](https://github.com/nestjs/nest) + [Fastify](https://www.fastify.cn/) + [Prisma](https://prisma.nodejs.cn/) + mysql + [TypeScript](https://www.tslang.cn/docs/home.html) 

## 功能

- 快速 CRUD：[查看文档](./src/modules/core/readme.md#Fast CRUD)，快速生成 crud 模块（只需定义 prisma 数据模型，便可生成 module、controller、service、dto 文件，有新增、单个查询、查询全部、分页查询、更新、批量删除、批量恢复等接口）；
- [OpenAPI/Swagger 文档](#OpenAPI/Swagger 文档)
- [统一异常于响应处理](#统一响应与异常处理)
- 单元测试： [查看文档](./src/modules/core/unit-test.md) ；
- file 文件上传/下载：上传到本地或OSS，生成文件预览地址；
- 消息队列：使用 [BullMQ](https://docs.bullmq.io/) 平滑处理高峰、分解可能阻塞Node.js事件循环的整体任务、在各种服务之间提供可靠的通信渠道；
- 缓存：使用 ioredis;
- 短信/邮件发送：使用消息队列；
- [JWT身份验证](#JWT身份验证)
- [权限管理](#权限管理)
- 日志：使用 winston 打印日志，保存在根目录 logs 文件夹;


- ~~Docker 部署~~ : 待完善
- [~~Serverless 部署~~](#Serverless 部署)
- [Prisma文档生成器](#Prisma文档生成器)


## 项目运行

### 运行环境

- 我的开发环境是 `node v18.17.0`、`pnpm 8.14.1`、`mysql 8`其他版本未测试;

### 运行配置

在运行项目之前，需要修改配置文件

- 在`.env` 文件里配置数据库连接；
- 在`.env.development`文件里配置 Redis、OSS、EMAIL、SMS信息  （非必需）;
- 还可在`src/config/index.ts` 文件里修改*全局路由前缀*、*图片上传目录*；

### 运行命令

#### Installation

```bash
$ pnpm install
```

#### Running the app

首次启动项目时，先按照下面的 prisma tips 步骤走。

```bash
# development
$ pnpm run start
# watch mode 开发时使用，可热重载
$ pnpm run start:dev
# production mode
$ pnpm run start:prod
```

项目运行后浏览器打开 `http://localhost:3000/swagger#` 查看api文档

#### prisma tips

- 首次启动前，先运行 `npx prisma migrate dev --name "init"` 将运行迁移脚本以在数据库中创建实体表。
- 然后运行 `npx prisma db seed` 命令来运行 `prisma/seed.ts` 文件，在数据库里生成初始数据。
- 将来，你需要在每次更改 Prisma 模型后运行 `npx prisma generate` 命令以更新生成的 Prisma 客户端(即更新TS类型)。
- 如果后续要同步数据库，那么使用`npx prisma db pull`或者`npx prisma db push`进行推送或拉取更新（如果在model里新增了非空字段且无默认值，那么push时会警告⚠️，需要使用`--force-reset`忽略所有警告，⚠️危险操作，会清空数据）
- push 和 pull 不会生成记录，如果要在`prisma/migrations`里生成记录，需要运行`migrate dev`命令,

[Prisma Migrate 的开发和生产](https://prisma.nodejs.cn/concepts/components/prisma-migrate/migrate-development-production)

## OpenAPI/Swagger 文档

使用[@nestjs/swagger](https://nest.nodejs.cn/openapi/introduction)集成swagger功能。

SwaggerModule 在路由处理程序中搜索所有 @Body()、@Query() 和 @Param() 装饰器以生成 API 文档。它还通过利用反射创建相应的模型定义，我们主要的心智负担在 DTO 上定义属性，当然，这个也可以靠[CLI插件](https://nest.nodejs.cn/openapi/cli-plugin)帮助生成，或者使用 Github Copilot 来面向TAB编程。

项目运行后打开 `http://localhost:3000/swagger#` 查看web文档，也可在`http://localhost:3000/swagger-json`查看json数据，导入到 Apifox 太方便了。

- 定义了自定义装饰器[ApiPaginatedResponse](./src/common/decorator/paginated.decorator.ts)，用于Swagger响应类型，但没有定义最外层的http响应类型装饰器，感觉没有必要，多处重复看起来杂乱，有TS类型就够了。
- swagger ui 里测试接口需要在右上角配置登录获取的token

## 统一响应与异常处理

- 在`/typings/response.d.ts`里定义了http响应的TS类型
- 在`src/common/interceptor/success-response.ts` 为成功的Http响应数据统一添加 code、msg、success 字段。
- 在`src/common/interceptor/http-faild.ts`里定义了HttpException拦截器，拦截后返回统一的json格式，记录到日志。
  - 但它不会拦截 Prisma 的异常，关于Prisma异常，可以重新定义一个 @Catch(PrismaClientValidationError)的拦截器，或者在 service 层手动处理，查看[官方文档:处理异常和错误](https://prisma.nodejs.cn/concepts/components/prisma-client/handling-exceptions-and-errors)
- class-validator 参数校验：用于dto的参数校验 https://www.npmjs.com/package/class-validator

## [JWT身份验证](https://nest.nodejs.cn/security/authentication#jwt-%E4%BB%A4%E7%89%8C)

- 在`class AuthGuard`中定义了全局守卫，如果要放开某些接口，使用自定义装饰器`@Guest()`即可，参考`auth/login`接口。

  > 未开放的接口需要在Header里传 Authorization，值为·`Bearer + 登录接口返回的token `; swagger ui 里运行需要在右上角配置，应该不用加上 Bearer 头；

- 自定义参数装饰器，用于获取token解析后的用户信息，用法如下：

```ts
import { User, UserJwtType } from '@/common/decorator/user.decorator'

@Get('test')
test(@ReqUser('id') id: number, @ReqUser() user: UserJwtType) {
  return {
    id,
    user: user,
  }
}
```

目前没有设计`refresh_token`给前端使用，我想不明白这么做的必要性，为了安全不如搞Https协议还有[CORS](https://nest.nodejs.cn/security/cors)和[CSRF保护](https://nest.nodejs.cn/security/csrf)，避免XSS攻击等。唯一的作用可能是存到数据库后用来感知用户退出登录、切换账号操作。

- [你有没有这样的疑惑，为什么要refreshToken？](https://juejin.cn/post/7081578246055133214)
- [前端使用RefreshToken?是道德的沦丧还是前端的瞎搞?](https://juejin.cn/post/7263117148373205049?from=search-suggest)



## 权限管理

使用二进制位运算进行权限管理，参考自[权限控制 | 使用二进制做权限控制功能](https://zhuanlan.zhihu.com/p/30103832)

在 `permission.guard.ts` 里定义了权限守卫，具体用法可参考`auth.controller.ts`文件。

## Serverless 部署

使用 vercel 部署这个项目遇到些问题，例如文件上传和日志等代码的存在会导致无法成功部署，还有环境变量的读取问题待解决。建议用 docker



## Prisma文档生成器

[Prisma文档生成器](https://github.com/pantharshit00/prisma-docs-generator) 从 Prisma 架构自动生成引用，可方便的查看 model 和 可使用的TS类型，每次运行时都会自动更新参考prisma generate。

scheme修改后，要更新文档请使用 `pnpm prisma:doc`命令，html文档生成在`prisma/docs`目录里。
可运行`npx prisma-docs-generator serve`命令开端口查看或者手动打开html文件看。

![Prisma 文档示例](https://user-images.githubusercontent.com/22195362/89097596-edeadc00-d3fd-11ea-91ea-86d5d8076da0.png)

[prisma社区生态](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#community-generators)