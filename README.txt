## Install the project packages

npm install

## Create or reset the Database (model)

node model.js --create

## Check the Database with a simple query

node model.js

## Run de server

npm start

## Check the API in the browser

http://localhost:9000/graphql

## START your PROJECT!!


Proyecto realizado en la asignatura de Tecnologías Emergentes.

Queremos crear una plataforma web en la cual los usuarios puedan crear eventos o unirse a eventos ya creados.
En el caso de crear un evento el usuario tendrá que rellenar los siguientes datos: titulo y descripción del evento,
fecha, hora, localización, tipo, etc... Además el organizador mostrará una lista de productos que se podrán consumir
el día del evento. También establecerá la aportación económica necesaria, en caso de sobrar se volverá a repartir
en partes iguales entre los asistentes.

En el caso de que los usuarios quieran asistir a un evento ya organizado deberán indicar si su asistencia será
individual o vendrán acompañados. A continuación, les saltará un formulario para elegir que quieren consumir durante el evento.


El propósito de esta plataforma web es facilitar al organizador de eventos una lista con sus participantes y sus preferencias
gastronómicas para así hacer un cálculo aproximado del coste total de las consumiciones del evento.
