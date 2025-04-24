import { myEvent } from "../Domain/Entities/Event.js";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { IAdmin } from "../Domain/Interfaces/IAdmin.js";

class Boss implements IAdmin{

    deleteProfile(speaker: Speaker): boolean {
        throw new Error("Method not implemented.");
    }
    makeAnEvent(event: myEvent): boolean {
        throw new Error("Method not implemented.");
    }
    deleteAnEvent(eventid: Number): boolean {
        throw new Error("Method not implemented.");
    }
    answerAFeedback(feedbackid: Number): boolean {
        throw new Error("Method not implemented.");
    }
    editProfile(speaker: Speaker): boolean {
        throw new Error("Method not implemented.");
    }

}