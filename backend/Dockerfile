FROM node:26-alpine3.23

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["sh", "-c", "npm run start:prod"]