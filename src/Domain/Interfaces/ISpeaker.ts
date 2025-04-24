import { myEvent } from "../Entities/Event.js";
import { Speaker } from "../Entities/Speaker.js";

export interface ISpeaker{

    makeAnEvent(event:myEvent): boolean;
    deleteAnEvent(eventid:Number): boolean;
    answerAFeedback(feedbackid:Number):boolean;
    editProfile(speaker:Speaker): boolean;


}