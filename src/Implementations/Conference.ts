import { IEvent } from "../Domain/Interfaces/IEvent.js";

class Conference implements IEvent{
    suscribeToAnEvent(eventid: Number): boolean {
        throw new Error("Method not implemented.");
    }
    unSuscribeFromAnEvent(eventid: Number): boolean {
        throw new Error("Method not implemented.");
    }
    isSubscribed(eventid: Number): boolean {
        throw new Error("Method not implemented.");
    }

}