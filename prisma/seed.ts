// 种子脚本，该脚本将使用 Prisma Client 来向数据库中添加一些初始数据。
// 该脚本将在每次运行 prisma migrate dev 时运行。

import { PrismaClient } from '@prisma/client';
// 初始化 prisma client
const prisma = new PrismaClient();

async function main() {
  // 创建用户
  // upsert方法在插入新记录时会检查是否已经存在具有相同唯一标识符的记录。如果存在，它将更新该记录。如果不存在，它将创建一个新记录。
  const user = await prisma.user.upsert({
    where: { email: 'riddler@gmail.com' },
    update: {},
    create: {
      name: 'Riddler',
      email: 'riddler@gmail.com',
      posts: {
        create: {
          title: 'Hello World',
          content: '你好哇',
        },
      },
    },
  });
  console.log('init', { user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
