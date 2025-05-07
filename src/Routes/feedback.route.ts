import { Router } from "express";
import {
  answerAFeedback,
  deleteAFeedback,
  dislikeAFeedback,
  getFeedbacks,
  getFeedbacksFromEvent,
  likeAFeedback,
  makeAFeedback,
  unDislikeAFeedback,
  unLikeAFeedback,
  updateAFeedback,
} from "../Controllers/feedback-controller.js";

const feedbacks = Router();

feedbacks.get("/api/feedbacks", getFeedbacks);
feedbacks.get("/api/feedbacks/:id", getFeedbacks);
feedbacks.get("/api/feedbacks/event/:id", getFeedbacksFromEvent);
feedbacks.post("/api/feedbacks", makeAFeedback);
feedbacks.patch("/api/feedbacks/:id", updateAFeedback);
feedbacks.patch("/api/feedbacks/like/:id", likeAFeedback);
feedbacks.patch("/api/feedbacks/dislike/:id", dislikeAFeedback);
feedbacks.patch("/api/feedbacks/unlike/:id", unLikeAFeedback);
feedbacks.patch("/api/feedbacks/undislike/:id", unDislikeAFeedback);
feedbacks.patch("/api/feedbacks/answer/:id", answerAFeedback);
feedbacks.delete("/api/feedbacks/:id", deleteAFeedback);

export default feedbacks; 
