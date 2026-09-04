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
    - footer with real links to the legal stuff and social media
    - completely hide the image carousel (so that it doesn't fetch images from the backend)
    - fix links to the social media

3) optimization problems:
    - look at siyuan
    - disable loading images for image carousel for small screens because
    - optimized 3d models and images in overall
    - server different resolution files for different kinds of screens (mobile, labtop, pc)

4) refactor ideas:
    - maybe put modal manager and tooltips into a srs/services or srs/lib folder and export needed stuff from there
