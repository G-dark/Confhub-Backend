import { Feedback } from "../Entities/Feedback.js";

export interface IFeedback{
    likeAFeedback(feedbackid:Number): boolean;
    dislikeAFeedback(feedbackid:Number): boolean;
    makeAFeedback(eventid:Number,feedback:Feedback): boolean;
    deleteAFeedback(feedbackid:Number): boolean;

}