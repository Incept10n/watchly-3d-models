before build

```
npm install
npx prisma generate
```

then build it)

```
npm run build
```

before running application:

```
npx prisma migrate deploy
```

---
.env file docs:
```
WH_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```
