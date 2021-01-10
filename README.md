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

### In my case

`taxi > taxi_app` <br />
`trips > trips` <br />

## URLs

### Django
> http://localhost:8001/api/sign_up/ <br />
> http://localhost:8001/api/log_in/ <br />

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
`ADD` -- similar OS copy command + you can use URL <br />
`COPY` -- similar OS copy command <br />
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
> docker run -d <br />
> docker images <br />
> docker run -it -d sample:dev -p 3001:3000 <br />

## Windows
> mklink "symbol_linked_db.sqlite3" "..\server\taxi\db.sqlite3" <br />