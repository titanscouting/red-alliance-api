# The Red Alliance - API
NodeJS REST API for interacting with MongoDB. Backend database for TRA. 

## Deploying the API
* The Docker image has been published to Docker Hub [here](https://hub.docker.com/r/titanscout2022/red-alliance-api). It exposes the HTTP interface at port 8190.

## Unit Testing 
* Run `yarn test` to run the Mocha/Chai tests.

## Documenation 

**REST API Documentation**

The REST API documention can be found [here](https://scouting.titanrobotics2022.com). It conforms to the Swagger OpenAPI v2 model and seperates both authenticated and public routes.

**Database handlers and internal documentation**

~~~Documentation for internal APIs can be found [here](https://titanscouting.github.io/red-alliance-api/).~~~

DB Handler docs are currently not rendered, please check in src/db-handlers/ for the TypeDoc annotations.


## Status Badges
![Unit Testing](https://github.com/titanscouting/red-alliance-api/workflows/Run%20Unit%20tests/badge.svg)

![Linting](https://github.com/titanscouting/red-alliance-api/workflows/Lint%20the%20API/badge.svg)

[![Coverage Status](https://coveralls.io/repos/github/titanscouting/red-alliance-api/badge.svg)](https://coveralls.io/github/titanscouting/red-alliance-api)

