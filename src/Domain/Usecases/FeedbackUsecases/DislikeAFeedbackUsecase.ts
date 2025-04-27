import { Opinion } from "../../../Implementations/Opinion.js";

export class DislikeAFeedbackUsecase{

   static async call(feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.dislikeAFeedback(feedbackid);
    }
}