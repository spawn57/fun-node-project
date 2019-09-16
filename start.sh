#!/bin/bash

echo "creating docker images:"
docker-compose -f "docker-compose.yml" up --build --no-start

