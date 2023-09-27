#!/usr/bin/env bash

docker build -t qa-api-mock .
docker tag qa-api-mock:latest 746295018053.dkr.ecr.eu-central-1.amazonaws.com/qa-api-mock:latest
docker push 746295018053.dkr.ecr.eu-central-1.amazonaws.com/qa-api-mock:latest
