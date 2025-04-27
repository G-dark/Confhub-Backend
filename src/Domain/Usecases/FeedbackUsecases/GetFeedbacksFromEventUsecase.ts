import { Opinion } from "../../../Implementations/Opinion.js";

export class GetFeedbacksFromEventUsecase{

   static async call(eventid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.getFeedbacksFromEvent(eventid);
    }
}