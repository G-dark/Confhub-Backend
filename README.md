# Confhub-Backend
This an api ceated to manage the data of a conference app using express, ts, a postgredb and node.

### Prerequisites

You should have PostgreSQL DB installed previously if not you can install it in 
[installation PostgreSQL](https://www-postgresql-org.translate.goog/download/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc) 

## Installation

In order to install the project you must make:
```bash
git clone <url-of-this-repository>
```

After that you must make a .env file following the .env.example
like this: 
```dotenv
PORT=3000 
HOST=localhost
DB_HOST=localhost 
DB_NAME=confhub_db 
DB_PORT=5432 
USER=postgres 
PASSWORD=YOUR_PASSWORD
PEPPER=YOUR_PEPPER
SALT_OR_ROUNDS=10
```
## Setup and poblate the database 

Exists a folder with the name of Create and poblate DB once you have postgre installed you've just do: 

```bash
node setup-database.js
```
in the path of that folder 

or simply you can do: 

```bash
npm run setup-db
```

## Usage

if you want to start the project, you can run any of the following scripts

```bash
npm run build
npm run start
```
or if you are in dev mode 
```bash
npm run dev
```


## Technologies

* [Express](https://expressjs.com/es/) - Web Enviroment Used.
* [Typescript](https://www.typescriptlang.org) - Language.
* [PostreSQL](https://www-postgresql-org.translate.goog/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc) - DB engine.



## Endpoints

# Events

Read - Get
baseURl/api/events/\[id] returns an event with that eventid 
Read - Get
baseURl/api/events returns every event 

Create - Post
baseURl/api/events

---valid input </br>
```json
{ 
    "title": "Buenas prácticas de programación en Java",
        "category": "Desarrollo",
        "location": "Risaralda, Colombia",
        "dateTime": "2025-08-26T11:00:00.000Z",
        "attendees": 13,
        "availableSpots": 120,
        "description": "Conoce técnicas y principios que te ayudarán a escribir código más limpio, legible y mantenible en Java.",
        "speakerName": "Felipe Montero",
        "speakerAvatar": "https://avatar.iran.liara.run/username?username=Felipe+Romero",
        "sessionOrder": [
            {
                "name": "Principios SOLID",
                "duration": 30
            },
            {
                "name": "Clean Code",
                "duration": 25
            },
            {
                "name": "Refactorización y patrones",
                "duration": 30
            }
        ],
        "tags": [
            "Java",
            "Clean Code",
            "Buenas prácticas"
        ],
        "avgScore": 0,
        "numberReviews": 0,
        "status": "Por empezar"
}
```
Delete - Delete
baseURl/api/events/\[id]

Update - Patch 
baseURl/api/events/\[id]

---valid input </br>
```json
{ 
    "title": "Buenas prácticas de programación en Javascript",
        "category": "Desarrollo web",
        "location": "Malambo, Colombia",
        "dateTime": "2025-08-26T11:00:00.000Z",
        "attendees": 13,
        "availableSpots": 120,
        "description": "Conoce técnicas y principios que te ayudarán a escribir código más limpio, legible y mantenible en Java.",
        "speakerName": "Felipe Montero",
        "speakerAvatar": "https://avatar.iran.liara.run/username?username=Felipe+Romero",
        "sessionOrder": [
            {
                "name": "Principios SOLID",
                "duration": 30
            },
            {
                "name": "Clean Code",
                "duration": 25
            },
            {
                "name": "Refactorización y patrones",
                "duration": 30
            }
        ],
        "tags": [
            "Java",
            "Clean Code",
            "Buenas prácticas"
        ],
        "avgScore": 0,
        "numberReviews": 0,
        "status": "Por empezar"
}
```
# Feedbacks

Read - Get all feedbacks
baseURl/api/feedbacks

Read - Get an feedback by id
baseURl/api/feedbacks/\[id]

Read - Get an feedback by eventid
baseURl/api/feedbacks/event/\[id]

Create - Post
baseURl/api/feedbacks

---valid input </br>
```json
  {
    "eventid": 83492175,
    "title": "Muy buen enfoque para expertos",
    "comment": "Este comentario destaca un punto importante del evento. Sin embargo, podría beneficiarse de más ejemplos concretos o aplicaciones prácticas que permitan entenderlo mejor.",
    "score": 4,
    "likes": 0,
    "dislikes": 0
  } 
```
Delete - Delete
baseURl/api/feedbacks/\[id]

Update - Patch 
baseURl/api/feedbacks/\[id]

fields that are not going to be updated can be omitted, for example: 
---valid input </br>
```json
  {
    "eventid": 83492175,
    "title": "Muy buen enfoque para expertos",
  } 
```
