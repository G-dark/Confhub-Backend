import { TrackEvent } from "../../../Implementations/TrackEvent.js";


export class ThisTrackExistsUsecase{

   static async call(name:string):Promise<boolean>{
        const trackEvent = new TrackEvent();
        return await trackEvent.thisTrackExists(name);
    }
}