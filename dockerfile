# 继承 node 镜像
FROM node:18-alpine3.19
# 设置 Alpine 镜像的时区
# ENV TZ=Asia/Shanghai
# RUN apk update \
#     && apk add tzdata \
#     && echo "${TZ}" > /etcr/timezone \
#     && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime \
#     && rm /var/cache/apk/*
# 在镜像中创建一个工作目录
WORKDIR /app
# 将项目文件复制到工作目录
COPY . .
# 设置环境变量
# ENV NODE_ENV production
# 设置镜像源
RUN npm config set registry https://registry.npmmirror.com
# 安装项目依赖 （接受不严格的依赖）
# 若使用 --production 只安装生产依赖的包(但这样无法编译成功，需要将dist文件一起上传)
RUN npm install --legacy-peer-deps
# 编译项目
RUN npm run build
# 暴露应用程序的端口
EXPOSE 3000
# 容器启动后执行 node 命令。
CMD node dist/main

# /Users/w2gd/Desktop/vol
# 构建镜像：docker build -t my-nest-app .
# 启动容器：docker run -itd -p 3000:3000 --name nestify-boot my-nest-app

# 启动容器并将日志目录和静态资源目录挂载到本地目录，举例如下：
# docker run -v /Users/w2gd/Desktop/vol/logs:/app/logs -v /Users/w2gd/Desktop/vol/nest-static:/nest-static -itd -p 3000:3000 --name nestify-demo2 nestify-demo