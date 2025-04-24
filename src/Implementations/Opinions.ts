import { Feedback } from "../Domain/Entities/Feedback.js";
import { IFeedback } from "../Domain/Interfaces/IFeedback.js";

class Opinions implements IFeedback{
    likeAFeedback(feedbackid: Number): boolean {
        throw new Error("Method not implemented.");
    }
    dislikeAFeedback(feedbackid: Number): boolean {
        throw new Error("Method not implemented.");
    }
    makeAFeedback(eventid: Number, feedback: Feedback): boolean {
        throw new Error("Method not implemented.");
    }
    deleteAFeedback(feedbackid: Number): boolean {
        throw new Error("Method not implemented.");
    }

}