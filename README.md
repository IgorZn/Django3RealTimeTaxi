https://coursehunters.online/t/testdriven-io-developing-a-real-time-taxi-app-with-django-channels-and-react-pt-1/3301

https://github.com/testdrivenio/taxi-react-app

###### **REDIS**

On notebook:

    `C:\Temp\redis-2.4.5-win32-win64\64bit`

### Postgres
Create a new database and user with the following commands:

`su postgres` <br />
`createdb -U postgres` <br />
`psql -U postgres` <br />
`<WHAT EVER NAME> =# CREATE USER taxi WITH SUPERUSER CREATEDB CREATEROLE PASSWORD 'taxi';` <br />
`<WHAT EVER NAME> =# CREATE DATABASE taxi OWNER taxi;` <br />
`dropdb taxi` <br />
`psql -f taxi.sql` <br />
`pg_dump taxi > taxi.bak` <br />

### In my case

`taxi > taxi_app` <br />
`trips > trips` <br />

## URLs

### Django
> http://localhost:8001/api/sign_up/ <br />
> http://localhost:8001/api/log_in/ <br />

### URLs
> http://localhost:8080/#/ <br />
> http://localhost:8080/#/log-in/ <br />
> http://localhost:8080/#/sign-up/ <br />
> http://localhost:8080/api/sign_up/ <br />
> http://localhost:8080/api/log_in/ <br />
> http://localhost:8080/admin/ <br />

### React
> http://localhost:3001 <br />
> http://localhost:3001/#/log-in <br />
> http://localhost:3001/#/sign-up <br />

## React Setup
> cd taxi-app <br />
> npx create-react-app client <br />
> cd client <br />
> npm start <br />


## Cypress
> npm install cypress --save-dev <br />
> npm uninstall cypress --save-dev <br />
> npx cypress open <br />
> npx cypress run --spec cypress/integration/authentication.spec.js <br />

## Docker
* **FROM**: tells Docker what base image to use as a starting point.
* **RUN**: executes commands inside the container.
* **WORKDIR**: changes the active directory.
* **USER**: changes the active user for the rest of the commands.
* **EXPOSE**: tells Docker which ports should be mapped outside the container.
* **CMD**: defines the command to run when the container starts.

> docker rmi $(docker images -a -q) <br />
> docker rmi $(docker images -a | grep none | awk '{ print $3; }' <br />
> docker-compose up -d <br />
> docker-compose down <br />
> docker-compose down && docker-compose up -d <br />
> docker-compose down && docker-compose up -d --build <br />
> docker-compose down && docker-compose build taxi-server <br />
> docker-compose up -d --build <br />
>
> docker build . -t taxi-server:latest <br />
> docker build . -t taxi-database:latest <br />
> docker build . -t taxi-client <br />
> docker build -f Dockerfile.client . -t igorzna/taxi-client <br />
> docker build -f Dockerfile.cypress . -t django3realtimetaxi_taxi-cypress <br />
> docker run -d <br />
> docker images <br />
> docker run -it -d sample:dev -p 3001:3000 <br />
> docker run -it -d igorzna/taxi-client:latest <br />
> docker-compose restart <SERVICE_NAME> <br />

## Windows
> mklink "symbol_linked_db.sqlite3" "..\server\taxi\db.sqlite3" <br />