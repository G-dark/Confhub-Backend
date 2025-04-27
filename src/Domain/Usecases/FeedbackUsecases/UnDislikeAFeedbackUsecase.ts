import { Opinion } from "../../../Implementations/Opinion.js";

export class UnDislikeAFeedbackUsecase{

   static async call(feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.unDislikeAFeedback(feedbackid);
    }
}