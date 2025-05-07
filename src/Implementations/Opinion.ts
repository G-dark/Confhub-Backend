import { Database } from "../DB/Database.js";
import { Feedback } from "../Domain/Entities/Feedback.js";
import { IFeedback } from "../Domain/Interfaces/IFeedback.js";

export class Opinion implements IFeedback {
  Opinion() {}

  async getFeedbacksFromEvent(eventid: number): Promise<boolean> {
    return await Database.read(eventid, "feedbacks", "eventid");
  }
  async thisFeedbackExists(feedbackid: number): Promise<boolean> {
    return await Database.idExists(feedbackid, "feedbacks", "id_");
  }
  async getFeedbacks(feedbackid: number): Promise<boolean> {
    return await Database.read(feedbackid, "feedbacks", "id_");
  }
  async updateAFeedback(
    feedback: Feedback,
    feedbackid: number
  ): Promise<boolean> {
    return await Database.update(feedbackid, "feedbacks", "id_", feedback);
  }
  async unLikeAFeedback(feedbackid: number): Promise<boolean> {
    const feedback = (await Database.read(feedbackid, "feedbacks", "id_"))[0];

    const result = await Database.updateAField(
      "feedbacks",
      "likes",
      "id_",
      feedback.likes - 1,
      feedbackid
    );

    return result;
  }
  async unDislikeAFeedback(feedbackid: number): Promise<boolean> {
    const feedback = (await Database.read(feedbackid, "feedbacks", "id_"))[0];

    const result = await Database.updateAField(
      "feedbacks",
      "dislikes",
      "id_",
      feedback.dislikes - 1,
      feedbackid
    );

    return result;
  }
  async likeAFeedback(feedbackid: number): Promise<boolean> {
    const feedback = (await Database.read(feedbackid, "feedbacks", "id_"))[0];

    const result = await Database.updateAField(
      "feedbacks",
      "likes",
      "id_",
      feedback.likes + 1,
      feedbackid
    );

    return result;
  }
  async dislikeAFeedback(feedbackid: number): Promise<boolean> {
    const feedback = (await Database.read(feedbackid, "feedbacks", "id_"))[0];

    const result = await Database.updateAField(
      "feedbacks",
      "dislikes",
      "id_",
      feedback.dislikes + 1,
      feedbackid
    );

    return result;
  }
  async makeAFeedback(feedback: Feedback): Promise<any> {
    const result = await Database.register("feedbacks", feedback);

    if (result) {
      return feedback;
    } else {
      return result
    }
  }
  async deleteAFeedback(feedbackid: Number): Promise<boolean> {
    return await Database.delete(feedbackid, "feedbacks", "id_");
  }
  async answerAFeedback(feedbackid: number, answer: string): Promise<boolean> {
    const result = await Database.updateAField(
      "feedbacks",
      "answer",
      "id_",
      answer,
      feedbackid
    );

    const result2 = await Database.updateAField(
      "feedbacks",
      "answerdatetime",
      "id_",
      new Date(Date.now()).toISOString(),
      feedbackid
    );
    return result && result2;
  }
}
