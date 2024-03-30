# 核心模块

## Fast-CRUD

快速生成 crud 模块（包含 module、controller、service、dto 文件）

步骤如下：

1. 定义 prisma 数据模型

   > 模型文件是 prisma/schema.prisma

   ```prisma
   model Cat {
     id        Int      @id @default(autoincrement())
     name      String   @db.VarChar(255)
     age       Int?
     deleted   Boolean? @default(false)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. 执行命令`pnpm prisma:push`生成（或修改)数据表，并更新prisma Client

   <img src="https://cdn.jsdelivr.net/gh/wardendon/wiki-image@main/img/image-20240302235302685.png" alt="image-20240302235302685" style="zoom:50%;" />

3. 执行命令`pnpm gen -m cats -p Cat` 生成 CRUD 模块

   > 运行成功后 cats 文件夹下会出现4个文件，如果 CatsService 会出现 ts error，需要在vscode搜索栏输入 `> Restart TS Server` 重启TS服务器。

   <img src="https://cdn.jsdelivr.net/gh/wardendon/wiki-image@main/img/image-20240302235657113.png" style="zoom:50%;" />

4. 将模块添加到 AppModule

   ```typescript
   import { CatsModule } from '@/modules/cats/cats.module'
   @Module({
     imports: [..., CatsModule]
   })
   export class AppModule {}
   ```

5. 运行服务，打开 swagger 页面测试接口

   ```bash
    pnpm start:dev
   ```

   > 浏览器打开 [Swagger UI](http://localhost:3000/swagger#/cats)

<img src="https://cdn.jsdelivr.net/gh/wardendon/wiki-image@main/img/image-20240303001732767.png" alt="image-20240303001732767" style="zoom:50%;" />

6. 补充 DTO

   > 参照其他模块的代码，补充DTO，然后放开 controller 文件里被注释掉的3行代码。

## file 文件上传/下载

- [github: fastify-file-interceptor](https://github.com/chanphiromsok/fastify-file-interceptor)
- [NestJS Upload File with FastifyAdapter](https://dev.to/rom858/nestjs-upload-file-with-fastifyadapter-3j34)

配合 `@fastify/static` 库，现在上传的文件会保存到项目外层的一个目录里，然后可以通过路由访问这些图片资源或静态文件。

## 消息队列

- [BullMQ](https://docs.bullmq.io/)
  平滑处理高峰、分解可能阻塞Node.js事件循环的整体任务、在各种服务之间提供可靠的通信渠道
