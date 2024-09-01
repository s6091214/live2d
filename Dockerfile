# 使用 Node.js 官方映像作為基礎映像
FROM node:22

# 設置工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 pnpm-lock.yaml 文件
COPY package.json pnpm-lock.yaml ./

# 安裝 pnpm（如果還未安裝）
RUN npm install -g pnpm

# 安裝依賴
RUN pnpm install

# 複製其餘的專案文件
COPY . .

# 構建專案
RUN pnpm build

# 暴露應用程序使用的端口
EXPOSE 3000

# 設置默認的命令來啟動應用
CMD [ "pnpm", "start" ]
