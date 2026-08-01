FROM node:26

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

# Ensure the generated files are in the right place
RUN if [ -d "/app/generated/prisma" ] && [ ! -d "/app/dist/generated/prisma" ]; then \
      mkdir -p /app/dist/generated && \
      cp -r /app/generated/prisma /app/dist/generated/; \
    fi

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npm run start:prod"]