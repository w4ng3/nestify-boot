<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
<p align="center">Nest 最佳实践</p>

## Description

技术栈： [Nest](https://github.com/nestjs/nest) + [Fastify](https://www.fastify.cn/) + Prisma + mysql

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## prisma tips

- 首次运行 `npx prisma migrate dev --name "init"` 将运行迁移脚本以在数据库中创建实体表。
- 运行 `npx prisma db seed` 命令来运行 prisma/seed.ts 文件，在数据库里生成初始数据。
- 将来，你需要在每次更改 Prisma 模型后运行 `prisma generate` 命令以更新生成的 Prisma 客户端(即更新TS类型)。
- 如果要同步数据库，那么使用`prisma db pull`或者`prisma db push`进行推送或拉取更新（如果在model里新增了非空字段且无默认值，那么push时会警告⚠️，需要使用`--force-reset`忽略所有警告）
- push 和 pull 不会生成记录，如果要在`prisma/migrations`里生成记录，需要运行`migrate dev`命令

### Prisma文档生成器

[Prisma文档生成器](https://github.com/pantharshit00/prisma-docs-generator) 从 Prisma 架构自动生成引用，可方便的查看 model 和 可使用的TS类型，每次运行时都会自动更新参考prisma generate。

scheme修改后，要更新文档请使用 `pnpm prisma:doc`命令，html文档生成在`prisma/docs`目录里。
可运行`npx prisma-docs-generator serve`命令开端口查看或者手动打开html文件看。

![Prisma 文档示例](https://user-images.githubusercontent.com/22195362/89097596-edeadc00-d3fd-11ea-91ea-86d5d8076da0.png)

### 更多

- 更多内容，查询[文档：数据库映射](https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping)
- [逆向生成数据库模型](https://blog.csdn.net/mcjentor/article/details/114157421) `npx prisma introspect`
- [Prisma Client: CRUD](https://prisma.nodejs.cn/concepts/components/prisma-client/crud)
- [Prisma Client: API](https://prisma.nodejs.cn/reference/api-reference/prisma-client-reference#prismaclient)
- [生成假数据](https://github.com/luisrudge/prisma-generator-fake-data)
- [生成 entity & DTO](https://github.com/kimjbstar/prisma-class-generator)
- [prisma社区生态](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#community-generators)

## License

Nest is [MIT licensed](LICENSE).

## technique

### [缓存](https://nest.nodejs.cn/techniques/caching)

`package.json` 文件中，已经安装了 `@nestjs/cache-manager` 和 `cache-manager` 这两个包。`@nestjs/cache-manager` 是 NestJS 的一个模块，它提供了一种简单的方式来使用缓存。 `cache-manager` 是一个通用的 Node.js 缓存模块，它支持多种缓存策略，如内存、Redis 等。

你可以在你的 NestJS 应用程序中使用这些包来实现缓存。例如，你可以使用 `@CacheKey` 和 `@CacheTTL` 装饰器来缓存特定的路由处理程序的结果。

```js
import { Controller, Get, CacheKey, CacheTTL } from '@nestjs/common'

@Controller('users')
export class UsersController {
  @Get()
  @CacheKey('allUsers')
  @CacheTTL(30 * 1000) // tips: cache-manager的v5版本以毫秒为单位提供ttl（v4以秒为单位）
  getUsers() {
    // This result will be cached for 30 seconds
    return this.userService.findAll()
  }
}
```

在这个示例中，getUsers 方法的结果将被缓存30秒。在这30秒内，如果有任何对同一路由的请求，NestJS 将不会调用 getUsers 方法，而是直接从缓存中返回结果。

更多方法可查看[github 仓库](https://github.com/node-cache-manager/node-cache-manager#readme)

## 进阶

- 序列化，全局序列化拦截器 https://3rcd.com/wiki/nestjs-practise/chapter5#序列化拦截器
- 自动序列化 https://3rcd.com/wiki/nestjs-practise/chapter5#自动序列化
- CRUD 抽象化框架构建 https://3rcd.com/wiki/nestjs-practise/chapter8

## CRUD 生成器

- [增删改查生成器（仅限 TypeScript）](https://nest.nodejs.cn/recipes/crud-generator)

  例如，运行 `nest g resource modules/users --no-spec` ，
  就会在 src/modules/users 目录下生成 users 的 dto & entities & module & controller & service 文件，`--no-spec`是避免生成测试文件。

## OpenAPI/Swagger 文档

使用[@nestjs/swagger](https://nest.nodejs.cn/openapi/introduction)集成swagger功能。

SwaggerModule 在路由处理程序中搜索所有 @Body()、@Query() 和 @Param() 装饰器以生成 API 文档。它还通过利用反射创建相应的模型定义，我们主要的心智负担在 DTO 上定义属性，当然，这个也可以靠[CLI插件](https://nest.nodejs.cn/openapi/cli-plugin)帮助生成，或者使用 Github Copilot 来面向TAB编程。

项目运行后打开 `http://localhost:3000/api#` 查看web文档，也可在`http://localhost:3000/api-json`查看json数据，导入到 Apifox 太方便了。

- 定义了自定义装饰器[ApiPaginatedResponse](./src/common/response/ApiPaginatedResponse.ts)，用于Swagger响应类型，但没有定义最外层的http响应类型装饰器，感觉没有必要，多处重复看起来杂乱，有TS类型就够了。

## 统一响应与异常处理

- 在`/typings/response.d.ts`里定义了http响应的TS类型

- 在`src/common/response/success-response.ts`

- 在`src/common/response/http-faild.ts`里定义了HttpException拦截器，拦截后返回统一的json格式。
  - 但它不会拦截 Prisma 的异常，关于Prisma异常，可以重新定义一个 @Catch(PrismaClientValidationError)的拦截器，或者在 service 层手动处理，查看[官方文档:处理异常和错误](https://prisma.nodejs.cn/concepts/components/prisma-client/handling-exceptions-and-errors)

## [JWT 身份验证](https://nest.nodejs.cn/security/authentication#jwt-%E4%BB%A4%E7%89%8C)

在`class AuthGuard`中定义了全局守卫，如果要放开某些接口，使用自定义装饰器`@Public()`即可，参考`auth/login`接口。

自定义参数装饰器，用于获取token解析后的用户信息，用法如下：

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

## 环境变量配置

使用 [@nestjs/config](https://nest.nodejs.cn/techniques/configuration)

## 日志

使用了`nest-winston` 和 `winston`来打印日志，`winston-daily-rotate-file`负责管理日志文件，定期压缩与删除。

已在全局响应和拦截器里使用，可参考用法。[Link~](src/common/response/http-faild.ts)
