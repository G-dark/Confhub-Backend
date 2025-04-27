import { Opinion } from "../../../Implementations/Opinion.js";

export class DeleteAFeedbackUsecase{

   static async call(feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.deleteAFeedback(feedbackid);
    }
}