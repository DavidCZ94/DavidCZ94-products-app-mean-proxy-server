# Products App MEAN Proxy Server

This repository is part of an application created with MEAN stack , this is the proxy server. You can see the other parts of the complete project in the next 
links [Angular Front end]( https://github.com/DavidCZ94/products-app-MEAN-frontend) and [API server](https://github.com/DavidCZ94/products-app-MEAN-api-server).

This project has been created with educational purposes and the objective is to achieve a complete web application using technologies based on JavaScript such as Mongodb, expressJs, Angular and nodeJs ( MEAN ). 

This server is in charge of receiving all the requests from the Front-end and directs them to the API server. The reason for adding this proxy is the implementation of an additional security layer between Front-end of the application and the API server, thus avoiding some of the tokens, keys, and access credentials used in the Api-server can be accessed from the Front-end, thus avoiding the connection of external applications to all sensitive information of the application.

I invite you to review the code to see the details of the implementation.

I hope that you enjoy the application and feel free to mention if the code has any errors I will gladly correct them.

## Run the aplication
  - Install [node JS](https://nodejs.org/es/download/) on your PC.
  - Clone or download project files.
```sh
$ git clone git@github.com:DavidCZ94/products-app-mean-proxy-server.git # or clone your own fork
```
  - Install the dependences
  ```sh
$ npm install
$ npm start
```
  - Config environment variables.
  - Run the project
  ```sh
$ npm start
```
