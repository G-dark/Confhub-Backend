import { Conference } from "../../../Implementations/Conference.js"


export class DeleteAnEventUsecase{

   static async call(eventid:number):Promise<boolean>{
        const conference = new Conference();
        return await conference.deleteAnEvent(eventid);
    }
}