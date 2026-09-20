### How to use current app:
- go to ```/``` for main ui
- go to ```/seeder``` for ui, made for seeding
- go to ```/orders``` for ui, made for viewing orders

### Site testing:
url: https://dev.watchly.inceptech.ru/

### How to run seeder.ts against prod database
```
kubectl port-forward postgresql-0 2398:5432 -n watchly-3d-models
npm run db:seed
```

### TODO:
1. main todo:
    - make production models
    - figure out how to connect opencode to figma [link](https://composio.dev/toolkits/figma/framework/opencode)
    - create mobile version
    - restrict access to /seeder and /orders urls (figure out how restricted access would work)

2. optimization problems:
    - server different resolution files for different kinds of screens (mobile, labtop, pc)

3. refactor ideas:
    - maybe put modal manager and tooltips into a srs/services or srs/lib folder and export needed stuff from there
