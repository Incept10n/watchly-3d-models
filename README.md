### How to use current app:
- go to ```/``` for main ui
- go to ```/seeder``` for ui, made for seeding

### Site testing:
url: https://dev.watchly.inceptech.ru/

### How to run seeder.ts against prod database
```
kubectl port-forward postgresql-0 2398:5432 -n watchly-3d-models
npm run db:seed
```

### TODO:
    - add message icon for last right button for the rigth sidebar
    - add them (even without implementation)
    - create modal sequence
    - finish order button logic
