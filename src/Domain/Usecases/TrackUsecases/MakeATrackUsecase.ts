import { TrackEvent } from "../../../Implementations/TrackEvent.js";
import { Track } from "../../Entities/Track.js";


export class MakeATrackUsecase{

   static async call(track:Track):Promise<boolean>{
        const trackEvent = new TrackEvent();
        return await trackEvent.makeATrack(track);
    }
}