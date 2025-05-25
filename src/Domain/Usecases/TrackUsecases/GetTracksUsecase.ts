import { TrackEvent } from "../../../Implementations/TrackEvent.js";


export class GetTracksUsecase{

   static async call(name?:string):Promise<any>{
        const trackEvent = new TrackEvent();
        return await trackEvent.getTracks(name);
    }
}