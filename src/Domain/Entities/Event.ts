
    export type myEvent = {
        eventid: number,
        title: string,
        category: string,
        location: string,
        dateTime:Date,
        attendees: number,
        availableSpots: number,
        description: string,
        speakerName:string,
        speakerAvatar:String,
        sessionOrder: JSON,
        tags: string[],
        avgScore:number,
        numberReviews:number,
        user_info:string,
        track:string,
        status:"Por empezar"|"Finalizado"
    }

