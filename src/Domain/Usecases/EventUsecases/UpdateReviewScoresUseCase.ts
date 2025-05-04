import { Conference } from "../../../Implementations/Conference.js";


export class UpdateReviewAvgScoreUsecase{

   static async call(eventid:number,action:-1|0|1):Promise<any>{
        const conference = new Conference();
        return await conference.updateReviewAvgScore(eventid,action);
    }
}