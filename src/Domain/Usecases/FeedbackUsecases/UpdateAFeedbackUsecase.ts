import { Opinion } from "../../../Implementations/Opinion.js";
import { Feedback } from "../../Entities/Feedback.js";

export class UpdateAFeedbackUsecase{

   static async call(feedback:Feedback,feedbackid:number):Promise<any>{
        const opinion = new Opinion();
        return await opinion.updateAFeedback(feedback,feedbackid);
    }
}