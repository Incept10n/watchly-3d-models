### How to use current app:
- go to ```/``` for main ui
- go to ```/seeder``` for ui, made for seeding

### TODO:
- write core functionality front without fancy styles and without actuall models (just diplay text for now)
    - write implementation for PartSelector and fetch compatability info on demand (after switching tab)
    ```
    cases are all available always
    movements on movements tab are available based on chosen case
    bezel is available based on the chosen case
    rest of the parts are available based on chosen movement
    ```
    for now after switcing each tab, we make request to check for compatability on ```/api/watch/compatible-parts?partId=${part}``` 
    we can optimze it by caching results!!!! if id of the part we are checking against doesn't chagne, then we return last value

- add 3d models instead of the text
