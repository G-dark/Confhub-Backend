import { Conference } from "../../../Implementations/Conference.js"


export class GetEventsFromATrackUsecase{

   static async call(name:string):Promise<any>{
        const conference = new Conference();
        return await conference.getEventsFromATrack(name);
    }
}