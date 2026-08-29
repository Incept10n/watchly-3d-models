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
1) main todo:
    - make it so that clients used ui from watchly website
    - tooltips feature (look below)
    - fix links to the social media

2) other features to add:
    - add tooltips for disabled items to say that they are disabed for a reason
    - need to decide where to setup the logic finding out why certain item is not available and where to construct the message for it

3) optimization problems:
    - optimized 3d models and images in overall
    - server different resolution files for different kinds of screens (mobile, labtop, pc)

4) refactor ideas:
    - maybe put modal manager into a srs/services folder and export needed stuff from there
