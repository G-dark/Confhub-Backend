import { Conference } from "../../../Implementations/Conference.js"


export class ThisEventExistsUsecase{

   static async call(eventid:number):Promise<boolean>{
        const conference = new Conference();
        return await conference.thisEventExists(eventid);
    }
}