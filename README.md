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

PORT=3000 </br>
HOST=localhost </br>
DB_NAME=confhub_db </br>
DB_PORT=5432 </br>
USER=postgres </br>
PASSWORD=YOUR_PASSWORD </br>

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
{ </br>
    "title": "Buenas prácticas de programación en Java",</br>
        "category": "Desarrollo",</br>
        "location": "Risaralda, Colombia",</br>
        "dateTime": "2025-08-26T11:00:00.000Z",</br>
        "attendees": 13,</br>
        "availableSpots": 120,</br>
        "description": "Conoce técnicas y principios que te ayudarán a escribir código más limpio, legible y mantenible en Java.",</br>
        "speakerName": "Felipe Montero",</br>
        "speakerAvatar": "https://avatar.iran.liara.run/username?username=Felipe+Romero",</br>
        "sessionOrder": \[</br>
            {</br>
                "name": "Principios SOLID",</br>
                "duration": 30</br>
            },</br>
            {</br>
                "name": "Clean Code",</br>
                "duration": 25</br>
            },</br>
            {</br>
                "name": "Refactorización y patrones",</br>
                "duration": 30</br>
            }</br>
        ],</br>
        "tags": \[</br>
            "Java",</br>
            "Clean Code",
            "Buenas prácticas"</br>
        ],</br>
        "avgScore": 0,</br>
        "numberReviews": 0,</br>
        "status": "Por empezar"</br>
}</br>

Delete - Delete
baseURl/api/events/\[id]

Update - Patch 
baseURl/api/events/\[id]

---valid input </br>
{ </br>
    "title": "Buenas prácticas de programación en Javascript",</br>
        "category": "Desarrollo web",</br>
        "location": "Malambo, Colombia",</br>
        "dateTime": "2025-08-26T11:00:00.000Z",</br>
        "attendees": 13,</br>
        "availableSpots": 120,</br>
        "description": "Conoce técnicas y principios que te ayudarán a escribir código más limpio, legible y mantenible en Java.",</br>
        "speakerName": "Felipe Montero",</br>
        "speakerAvatar": "https://avatar.iran.liara.run/username?username=Felipe+Romero",</br>
        "sessionOrder": \[</br>
            {</br>
                "name": "Principios SOLID",</br>
                "duration": 30</br>
            },</br>
            {</br>
                "name": "Clean Code",</br>
                "duration": 25</br>
            },</br>
            {</br>
                "name": "Refactorización y patrones",</br>
                "duration": 30</br>
            }</br>
        ],</br>
        "tags": \[</br>
            "Java",</br>
            "Clean Code",
            "Buenas prácticas"</br>
        ],</br>
        "avgScore": 0,</br>
        "numberReviews": 0,</br>
        "status": "Por empezar"</br>
}</br>

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
  {</br>
    "eventid": 83492175,</br>
    "title": "Muy buen enfoque para expertos",</br>
    "comment": "Este comentario destaca un punto importante del evento. Sin embargo, podría beneficiarse de más ejemplos concretos o aplicaciones prácticas que permitan entenderlo mejor.",</br>
    "score": 4,</br>
    "likes": 0,</br>
    "dislikes": 0</br>
  } </br>

Delete - Delete
baseURl/api/feedbacks/\[id]

Update - Patch 
baseURl/api/feedbacks/\[id]

fields that are not going to be updated can be omitted, for example: 
---valid input </br>
  {</br>
    "eventid": 83492175,</br>
    "title": "Muy buen enfoque para expertos",</br>
  } </br>
