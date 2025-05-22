import { TrackEvent } from "../../../Implementations/TrackEvent.js";


export class DeleteATrackUsecase{

   static async call(name:string):Promise<boolean>{
        const trackEvent = new TrackEvent();
        return await trackEvent.deleteATrack(name);
    }
}