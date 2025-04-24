
    export type myEvent = {
        eventid: Number,
        title: String,
        category: String,
        location: String,
        dateTime:Date,
        attendees: Number,
        availableSpots: Number,
        description: String,
        speakerName:String,
        speakerAvatar:String,
        sessionOrder: JSON,
        tags: String[],
        avgScore:Number,
        numberReviews:Number,
        status:"Por empezar"|"Finalizado"
    }

