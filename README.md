### How to use current app:
- go to ```/``` for main ui
- go to ```/seeder``` for ui, made for seeding

### TODO:
- frontend:
    - add caching to fetching compatible part
    - bug 
        TEST CASE:
        - open app
        - look at dial tab, everything is normal
        - open case tab
        - choose another case
        - switch to dial tab
        - we see old dials (compatible with movement 1, because movement 2 was not yet selected because we never went to that tab)
        SOLUTION:
        - rebuild dependency tree when we change something other than leafes
- ci / cd:
    - add so that react-router routing works properly
    TEST CASE:
        - going to /seeeder works fine
