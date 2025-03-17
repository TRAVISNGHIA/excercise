# Sử dụng Node.js LTS làm base image
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://nghianh:6d0yfrpx2tbw7hmz@137.184.250.68:27017/sem?authSource=admin

# Build Next.js project
RUN npm run build

# Mở cổng 3000
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
