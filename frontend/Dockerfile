FROM node:26-alpine3.23 AS builder

WORKDIR /app

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]