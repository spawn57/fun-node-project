echo "initializing database"
#./docker/db/wait-for-it.sh -t 500 127.0.0.1:3306 -- echo "database is up"
docker exec -i db sh -c 'exec mysql -uroot -pmysecret' < docker/db/webapp_init.sql