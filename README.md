Start the projects run the script

./start_sh

it will fail to start properly the first time round. 
you'll need to find the ip of the database docker, and add an entry to your host file

<ip of db container> db

once that happens run ./start_sh to start the dockers

to run the tests run the command

To run the integration tests, you must have npm and node locally

run the commands:
npm install
node ./node_modules/selenium-cucumber-js/index.js -x 50000

you can import the postman collection to test the api