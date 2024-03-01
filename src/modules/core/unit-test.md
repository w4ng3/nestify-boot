# 单元测试

[Expect · Jest中文文档 | Jest中文网 (jestjs.cn)](https://www.jestjs.cn/docs/expect)

## 基本用法

以 `AppService` 为例：

- app.service.ts 

```typescript
import { Injectable } from '@nestjs/common'
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
```

- 同目录下新建一个测试文件`app.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from './app.service'

// describe块将所有与CoffeeService类相关的单元测试分组
describe('AppService', () => {
  let appService: AppService
  // 在每次测试之前执行的钩子函数，称为设置阶段，出此之外，还有 beforeAll(),afterEach(),afterAll()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile() // 利用这个模块获取CoffeesService，compile()引导模块及其依赖项，类似于main.ts中的bootstrap
    appService = module.get<AppService>(AppService)
  })
  // it表达单独测试，该测试目前仅检查是否定义了service变量
  it('should return "Hello World!"', () => {
    // 每次要测试一个值时都要使用 expect函数
    // toBe 是一个匹配器，用于检查函数的返回值是否等于预期值
    expect(appService.getHello()).toBe('Hello World!')
  })
})
```



- 终端运行测试命令: `pnpm run test:watch --app.service`

  - 测试通过

    <img src="https://cdn.jsdelivr.net/gh/wardendon/wiki-image@main/img/image-20240301150512353.png" alt="image-20240301150512353" style="zoom:50%;" />

  - 测试失败

    <img src="https://cdn.jsdelivr.net/gh/wardendon/wiki-image@main/img/image-20240301150548401.png" alt="image-20240301150548401" style="zoom:40%;" />



> tips: vscode 可以安装插件`Jest Run It`，重新打开测试文件后，可看到测试用例上方的启动图标，点击即可测试。

---

当 `service` 或者` controller` 需要注入 其他依赖时，比如和操作数据库的 `PrismaService` ，那么还需要在测试文件的`beforeEach ` 里额外注入，示例如下：

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { PostsService } from './posts.service'
import { PrismaService } from '@/common/prisma/prisma.service'
import { Post } from '@prisma/client'

describe('PostsService', () => {
  let service: PostsService
  // 在每次测试之前执行的钩子函数，称为设置阶段，出此之外，还有 beforeAll(),afterEach(),afterAll()
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService, PrismaService],
    }).compile()

    service = module.get<PostsService>(PostsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('findAll 方法应返回 deleted 都为 fasle 的数组', async () => {
    const list = await service.findAll()
    list.forEach((obj: Post) => {
      expect(obj.deleted).toBe(false)
    })
  })
})
```

