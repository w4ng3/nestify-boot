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

- 更多内容，查询[文档：数据库映射](https://www.prisma.io/docs/orm/prisma-schema/data-model/database-mapping)
- [逆向生成数据库模型](https://blog.csdn.net/mcjentor/article/details/114157421) `npx prisma introspect`
- [Prisma Client: CRUD](https://prisma.nodejs.cn/concepts/components/prisma-client/crud)
- [Prisma Client: API](https://prisma.nodejs.cn/reference/api-reference/prisma-client-reference#prismaclient)

## License

Nest is [MIT licensed](LICENSE).

## technique

### [缓存](https://nest.nodejs.cn/techniques/caching)

`package.json` 文件中，已经安装了 `@nestjs/cache-manager` 和 `cache-manager` 这两个包。`@nestjs/cache-manager` 是 NestJS 的一个模块，它提供了一种简单的方式来使用缓存。 `cache-manager` 是一个通用的 Node.js 缓存模块，它支持多种缓存策略，如内存、Redis 等。

你可以在你的 NestJS 应用程序中使用这些包来实现缓存。例如，你可以使用 `@CacheKey` 和 `@CacheTTL` 装饰器来缓存特定的路由处理程序的结果。

```js
import { Controller, Get, CacheKey, CacheTTL } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  @CacheKey('allUsers')
  @CacheTTL(30 * 1000) // tips: cache-manager的v5版本以毫秒为单位提供ttl（v4以秒为单位）
  getUsers() {
    // This result will be cached for 30 seconds
    return this.userService.findAll();
  }
}
```

在这个示例中，getUsers 方法的结果将被缓存30秒。在这30秒内，如果有任何对同一路由的请求，NestJS 将不会调用 getUsers 方法，而是直接从缓存中返回结果。

更多方法可查看[github 仓库](https://github.com/node-cache-manager/node-cache-manager#readme)

## 进阶

- 序列化，全局序列化拦截器 https://3rcd.com/wiki/nestjs-practise/chapter5#序列化拦截器
- 自动序列化 https://3rcd.com/wiki/nestjs-practise/chapter5#自动序列化
- CRUD 抽象化框架构建 https://3rcd.com/wiki/nestjs-practise/chapter8
