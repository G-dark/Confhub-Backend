import { Feedback } from "../Entities/Feedback.js";

export interface IFeedback {
  likeAFeedback(feedbackid: number): Promise<boolean>;
  unLikeAFeedback(feedbackid: number): Promise<boolean>;
  dislikeAFeedback(feedbackid: number): Promise<boolean>;
  unDislikeAFeedback(feedbackid: number): Promise<boolean>;
  makeAFeedback(feedback: Feedback): Promise<any>;
  deleteAFeedback(feedbackid: number): Promise<boolean>;
  getFeedbacks(feedbackid:number):Promise<boolean>;
  updateAFeedback(feedback:Feedback,feedbackid:number): Promise<boolean>;
  answerAFeedback(feedbackid: number, answer: string): Promise<boolean>;
  thisFeedbackExists(feedbackid:number):Promise<boolean>;
  getFeedbacksFromEvent(eventid:number):Promise<boolean>;

}
