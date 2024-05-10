# 继承 node 镜像
# FROM node:lts-alpine
FROM node:latest
# 在镜像中创建一个工作目录，相当于 cd /app
WORKDIR /app
# 将项目文件复制到工作目录
COPY . .
# 设置镜像源
RUN npm config set registry https://registry.npmmirror.com
# 安装项目依赖 （接受不严格的依赖）
RUN npm install --legacy-peer-deps
# 编译项目 ...但失败了
# RUN npm run build:test 
# 暴露应用程序的端口
EXPOSE 3000
# 容器启动后执行 node 命令。
CMD node dist/main

# 构建镜像： docker build -t my-nest-app .
# 启动容器： docker run -itd -p 3000:3000 --name nestify-boot my-nest-app
