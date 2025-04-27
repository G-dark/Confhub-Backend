import { Opinion } from "../../../Implementations/Opinion.js";

export class GetFeedbacksUsecase{

   static async call(feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.getFeedbacks(feedbackid);
    }
}