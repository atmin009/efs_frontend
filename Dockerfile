# ใช้ Node.js image เป็น base image
FROM node:18 AS build

# ตั้งค่าตำแหน่งทำงาน
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json มาที่ container
COPY package.json package-lock.json ./

# ติดตั้ง dependencies โดยข้ามข้อกำหนด peer dependencies
RUN npm install --legacy-peer-deps

# คัดลอกไฟล์ที่เหลือของโปรเจค
COPY . .

# สร้าง build ของ React app
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# ใช้ Nginx image เป็น base image สำหรับการ serve static files
FROM nginx:alpine

# คัดลอก build output จาก build stage ไปยัง Nginx
COPY --from=build /app/build /usr/share/nginx/html

# เปิดพอร์ต 80
EXPOSE 80

# เริ่ม Nginx
CMD ["nginx", "-g", "daemon off;"]
