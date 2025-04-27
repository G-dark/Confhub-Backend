import { Opinion } from "../../../Implementations/Opinion.js";

export class ThisFeedbackExistsUsecase{

   static async call(feedbackid:number):Promise<boolean>{
        const opinion = new Opinion();
        return await opinion.thisFeedbackExists(feedbackid);
    }
}