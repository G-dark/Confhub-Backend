import { Opinion } from "../../../Implementations/Opinion.js";

export class AnswerAFeedbackUsecase{

   static async call(feedbackid:number,answer:string):Promise<any>{
        const opinion = new Opinion();
        return await opinion.answerAFeedback(feedbackid,answer);
    }
}