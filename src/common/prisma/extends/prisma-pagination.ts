import { PaginatedVo, PaginationOptions } from '@/common/model/paginate'
import { Prisma } from '@prisma/client'

/**
 * @description: 为PrismaClient添加分页功能
 * 代码参考自 github.com/mohammadhosseinmoradi/prisma-pagination-extension
 * 关于添加扩展可查看官方文档：https://prisma.nodejs.cn/concepts/components/prisma-client/client-extensions#添加-prisma-客户端扩展
 */
export default Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async paginate<T, A>(
        this: T,
        args?: Prisma.Exact<A, Prisma.Args<T, 'findMany'>> & {
          pagination?: PaginationOptions
        },
      ) {
        const { pagination, ...operationArgs } = (args ?? {}) as any

        // Calculate the page.
        const page = args?.pagination?.page ? Number(args.pagination.page) : 1

        // Calculate the pageSize.
        const pageSize = args?.pagination?.pageSize ? Number(args.pagination.pageSize) : 12

        // Calculate the skip.
        const skip = page > 1 ? pageSize * (page - 1) : 0

        // Run two operations in parallel and get results.
        const [data, total]: [Prisma.Result<T, A, 'findMany'>, number] = await Promise.all([
          (this as any).findMany({
            ...operationArgs,
            skip,
            take: pageSize,
          }),
          (this as any).count({ where: operationArgs?.where }),
        ])

        const results: PaginatedVo<any> = {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
          list: data,
        }
        return results
      },
    },
  },
})
// 解释代码
// 1. 首先，我们使用 Prisma.defineExtension 创建一个新的 Prisma 扩展。
// 2. 然后，我们使用 model.$allModels 选择所有模型。
// 3. 接下来，我们定义 paginate 方法，该方法接收一个 Prisma 模型作为参数。
// 4. 然后，我们使用 Prisma.Result<T, A, 'findMany'> 为 paginate 方法定义返回类型。
// 5. 最后，我们返回一个JS对象，其中包含查询结果和分页元数据。
// 6. 最后，导出 Prisma 扩展。
