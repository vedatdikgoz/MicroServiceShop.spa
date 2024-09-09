# Stage 1: Build Angular application
FROM node:latest AS build
ENV NODE_ENV production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Serve with Nginx
FROM nginx:latest
COPY /dist/micro-service-shop.spa/browser /usr/share/nginx/html
EXPOSE 80
