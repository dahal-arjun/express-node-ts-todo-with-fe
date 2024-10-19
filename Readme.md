### Getting Started with this project.

Make sure you have these things installed in your machine

1. Docker

#### To run this project

Paste the following code in terminal. (This will copy the example.)

```bash
cp .env.example .env
```

Now, add fill with the creds in the .env file. Once you are done with the changes.\
Paste the following code in the terminal.\
This command should run the mysql db, server & frontend\
It should work like magic. If not have to configure the project.

```bash
    docker-compose up --build -d
```

### Architecture and Design Decisions For Backend

- I have used the MVC pattern.\
  This is a simple todo app with basic features.\
  MVC balances the requirement and shows a simple speration of the concerns.\
  Making it simple and straight is something that, I am looking to achieve in this project.

- This server will be a simple api server.\
  I have implemented react as client.\
  Cuz it will be refresher for me as well.

  ### Architecture and Design Decision for Frontend

  - not much its just a quick and dirty hack to run and show the crud operation
