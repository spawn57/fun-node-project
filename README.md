# Building the containers
Build the docker containers usining the following command

`./start.sh`

start the database by running the command, The database will take some time to start up 

`docker start db`

once it is started, run the command to start the web app.  Do configure the webapp in the configuration section before running the command.

`docker start webapp`

the api should now be ready to use, you can see the list by going to following URL

http://localhost:8080/orders?page=0&limit=5

Note the a postman collection is added to the project, the relevant section below

# Configuration

## Database
you'll need to find the ip of the database docker using node-inspect by using the command

`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' db`

update the config.json in the app directory with the ip address of the database docker

## Google Maps API key
update the config.json with your google api key

# Development tools
be sure to have nodejs and npm installed locally to do these tasks.

## Postman 
If you use postman, be sure to import the Postman collection file stored in the project root. 

## Running the app locally
be sure to only have the database container running by running the following commands

`npm start:db`

`npm start`

To run in debug mode run

`npm start:debug` 

## Logging
logging is stored in the file application.log

## Tests
To run the tests locally,   Note that to run the integration test, the container or an instance of the node application needs to be running

to run the tests run the command:

`npm run test`

to run just the unit tests run:

`npm run test:unit`

to run just the integration tests, be sure to have the container running

`npm run test:integration`

to run the unit or integration test in debug mode, run the command

`npm run test:unit:debug`

`npm run test:integration:debug`
