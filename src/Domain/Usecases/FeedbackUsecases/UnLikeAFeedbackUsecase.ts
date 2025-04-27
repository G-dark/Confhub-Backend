import { Opinion } from "../../../Implementations/Opinion.js";

export class UnLikeAFeedbackUsecase{

   static async call(feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.unLikeAFeedback(feedbackid);
    }
}