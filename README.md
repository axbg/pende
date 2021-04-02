# pende
<img src="https://raw.githubusercontent.com/axbg/pende/master/front/src/assets/logo.png?token=AF6UYGMJLADKNCPUSTCVTOC7OOMS6" width=150>

# 
## An easy-to-use, experimental web-based IDE

The app was developed as part of **BUES' Student Scientific Communication Sessions 2019** organized by **The Faculty of Economic Cybernetics, Statistics and Informatics** and [won the first place](http://csie.ase.ro/sesiune-stiintifica-studenteasca)

The app is built using Node.js/Express, Socket.io & Angular and supports C and C++, but can be easily extended to multiple languages due to its modular approach 

Besides a configurable text editor based on [Ace](https://ace.c9.io/), *pende* features a minimal file manager & basic debug support

#
### Running the app
1. Development
    * Run `npm install` in both directories (back, front)
    * Prepare a MongoDB instance running on default port (27017)
    * Update the values stored in `back/.env ` 
        * PROD=run the app in dev(0) or prod(1) mode
        * PORT=the port where the application will be exposed on
        * MONGO_HOST=`localhost` 
        * MONGO_DB=the name of the MongoDB database
    * Fill the required front-end variables
        * [BASE_URL](/front/src/environments/environment.ts) = `http://localhost:THE_PORT_FROM_.ENV_FILE`
        * [GOOGLE_CLIENT_ID](/front/src/environments/environment.ts) = your Google auth client key
    * Start the back-end: `npm start` in back
    * Start the front-end: `npm start` in front

2. Production
    * Prepare a MongoDB instance running on default port (27017)
    * Create a `.env ` file and fill it with the following values 
        * PROD=1
        * MONGO_HOST=database_host *(defaults to `host.docker.internal` otherwise)*
        * MONGO_DB=database_name *(defaults to `pende` otherwise)*
        * GOOGLE_CLIENT_ID=google_client_id
    * Run the Docker container
        * `docker run -p 8080:8080 --env-file ./.env --name pende axbg/pende` 
