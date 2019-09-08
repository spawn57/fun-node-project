#!/bin/bash

echo "creating docker images:"
docker-compose -f "docker-compose.yml" up -d --build

echo "waiting for database"
chmod +x ./docker/db/wait-for-it.sh

echo "run init-db to initialize the database"
