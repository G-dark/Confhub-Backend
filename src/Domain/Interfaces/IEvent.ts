import { myEvent } from "../Entities/Event.js";

export interface IEvent{
    thisEventExists(eventid:number):Promise<boolean>;
    makeAnEvent(event:myEvent):Promise<boolean>;
    updateReviewAvgScore(eventid:number,action:-1|0|1):Promise<boolean>;
    updateAnEvent(event:myEvent, eventid:number):Promise<boolean>;
    deleteAnEvent(eventid:number):Promise<boolean>;
    getEvents(eventid:number):Promise<any>;
    suscribeToAnEvent(eventid:number): Promise<boolean>;
    unSuscribeFromAnEvent(eventid:number): Promise<boolean>;
    getEventsFromATrack(name:string):Promise<any>;

}