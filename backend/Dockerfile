FROM node:26

WORKDIR /app
COPY . .

# COPY package*.json ./
# COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run start:prod"]
