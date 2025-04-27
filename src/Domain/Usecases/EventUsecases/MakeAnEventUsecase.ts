import { Conference } from "../../../Implementations/Conference.js"
import { myEvent } from "../../Entities/Event.js";


export class MakeAnEventUsecase{

   static async call(event:myEvent):Promise<boolean>{
        const conference = new Conference();
        return await conference.makeAnEvent(event);
    }
}