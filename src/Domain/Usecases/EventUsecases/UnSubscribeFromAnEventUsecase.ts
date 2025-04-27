import { Conference } from "../../../Implementations/Conference.js"
import { myEvent } from "../../Entities/Event.js";

export class UnSuscribeFromAnEventUsecase{

   static async call(eventid:number):Promise<boolean>{
        const conference = new Conference();
        return await conference.unSuscribeFromAnEvent(eventid);
    }
}