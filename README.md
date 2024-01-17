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
