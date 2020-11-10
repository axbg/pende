# pende
<img src="https://raw.githubusercontent.com/axbg/pende/master/front/src/assets/logo.png?token=AF6UYGMJLADKNCPUSTCVTOC7OOMS6" width=150>

# 
## An easy-to-use, experimental web-based IDE

The app was developed as part of **BUES' Student Scientific Communication Sessions 2019** organized by **The Faculty of Economic Cybernetics, Statistics and Informatics** and [won the first place](http://csie.ase.ro/sesiune-stiintifica-studenteasca)

The app is built using Node.js/Express, Socket.io & Angular and supports C and C++, but can be easily extended to multiple languages due to its modular approach 

Besides a configurable text editor based on [Ace](https://ace.c9.io/), *pende* features a minimal file manager & basic debug support

#
### Running the app
1. Manually

    * Run `npm install` in both directories (back, front)
    * Prepare a MongoDB instance running on default port (27017)
    * Update the values stored in `back/.env ` 
        * PROD=run the app in dev(0) or prod(1) mode
        * PORT=the port where the application will be exposed on
        * MONGO_HOST=`localhost` 
        * MONGO_DB=the name of the MongoDB database
    * Fill the required front-end constants
        * [BASE_URL](/front/src/app/classes/Constants.ts) = `http://localhost:THE_PORT_FROM_.ENV_FILE`
        * [GOOGLE_CLIENT_ID](/front/src/app/classes/Constants.ts) = your Google auth client key
    * Execute the back-end: `npm start` in back
    * Execute the front-end: `npm start` in front

2. Using Docker

    * Prepare a MongoDB instance running on default port (27017)
    * Update the values stored in `back/.env ` 
        * PROD=1
        * PORT=8080
        * MONGO_HOST=`host.docker.internal`
        * MONGO_DB=the name of the MongoDB database
   * Fill the required front-end constants
        * [BASE_URL](/front/src/app/classes/Constants.ts) = ''
        * [GOOGLE_CLIENT_ID](/front/src/app/classes/Constants.ts) = your Google auth client key
    * Run [build.sh](/build.sh)
    * Run the Docker container
        * `docker run -d --name pende -p 8080:8080 --env-file /path/to/back/.env .` 

3. Using Docker-Compose

    * Update the values stored in `back/.env ` 
        * PROD=1
        * PORT=the port where the application will be exposed on
        * MONGO-HOST=`db`
        * MONGO_DB=the name of the MongoDB database
   * Fill the required front-end constants
        * [BASE_URL](/front/src/app/classes/Constants.ts) = ''
        * [GOOGLE_CLIENT_ID](/front/src/app/classes/Constants.ts) = your Google auth client key
    * Run [build.sh](/build.sh)
    * Navigate to the root of this project and execute
        * `docker-compose up`
