import { Opinion } from "../../../Implementations/Opinion.js";
import { Feedback } from "../../Entities/Feedback.js";

export class MakeAFeedbackUsecase{

   static async call(feedback:Feedback):Promise<any>{
        const opinion = new Opinion();
        return await opinion.makeAFeedback(feedback);
    }
}