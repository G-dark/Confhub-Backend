import { TrackEvent } from "../../../Implementations/TrackEvent.js";
import { Track } from "../../Entities/Track.js";



export class UpdateATrackUsecase{

   static async call(track:Track,name:string):Promise<boolean>{
        const trackEvent = new TrackEvent();
        return await trackEvent.updateATrack(track,name);
    }
}