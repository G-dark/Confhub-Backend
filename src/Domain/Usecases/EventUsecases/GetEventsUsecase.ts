import { Conference } from "../../../Implementations/Conference.js"


export class GetEventsUsecase{

   static async call(eventid?:number):Promise<any>{
        const conference = new Conference();
        return await conference.getEvents(eventid);
    }
}