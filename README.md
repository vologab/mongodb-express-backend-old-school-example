# ES5 ExpressJS and Mongoose RESTFul API example

## 1. Define ENV variables

Check `.env.sample`

```bash
# HTTP settings
PORT=3000

# DB settings
DB_URI = 'mongodb://localhost'
DB_URI_OPTIONS = ''
DB_NAME = 'Business-test'

# Log options
LOG_LEVEL=debug

```

## 2. Check tests
```bash
npm test
```

## 3. Provide corresponding ENV variables and run
```bash
# node -r dotenv/config src/server.js
node src/server.js
```


## 4. TODO

* Increase test coverage
* Add input validation
* Add Docker/NGINX/ .... other infrastructure
* Add better error handling and logging