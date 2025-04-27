import { Conference } from "../../../Implementations/Conference.js"
import { myEvent } from "../../Entities/Event.js";


export class UpdateAnEventUsecase{

   static async call(event:myEvent,eventid:number):Promise<boolean>{
        const conference = new Conference();
        return await conference.updateAnEvent(event,eventid);
    }
}