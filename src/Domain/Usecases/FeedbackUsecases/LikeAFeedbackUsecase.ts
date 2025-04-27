import { Opinion } from "../../../Implementations/Opinion.js";

export class LikeAFeedbackUsecase{

   static async call(feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.likeAFeedback(feedbackid);
    }
}