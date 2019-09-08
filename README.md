Start the projects run the command

docker-compose -f "docker-compose.yml" up -d --build



To run the integration tests, you must have npm and node locally

run the commands:
npm install
node ./node_modules/selenium-cucumber-js/index.js -x 50000
