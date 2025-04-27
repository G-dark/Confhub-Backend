import { Request, Response } from "express";
import { GetFeedbacksUsecase } from "../Domain/Usecases/FeedbackUsecases/GetFeedbacksUsecase.js";
import { GetFeedbacksFromEventUsecase } from "../Domain/Usecases/FeedbackUsecases/GetFeedbacksFromEventUsecase.js";
import { ThisEventExistsUsecase } from "../Domain/Usecases/EventUsecases/ThisEventExistsUsecase.js";
import { AnswerAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/AnswerAFeedbackUsecase.js";
import { ThisFeedbackExistsUsecase } from "../Domain/Usecases/FeedbackUsecases/ThisFeedbackExistUsecase.js";
import { DeleteAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/DeleteAFeedbackUsecase.js";
import { UpdateAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/UpdateAFeedbackUsecase.js";
import { Feedback } from "../Domain/Entities/Feedback.js";
import { MakeAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/MakeAFeedbackUsecase.js";
import { LikeAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/LikeAFeedbackUsecase.js";
import { UnLikeAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/UnLikeAFeedbackUsecase.js";
import { DislikeAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/DislikeAFeedbackUsecase.js";
import { UnDislikeAFeedbackUsecase } from "../Domain/Usecases/FeedbackUsecases/UnDislikeAFeedbackUsecase.js";
import { generateRandomId } from "../Utils/tools.js";

export const getFeedbacks: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await GetFeedbacksUsecase.call(Number(id));
    return result.length > 0
      ? res.json(result)
      : res.json({ msg: "Sin feedbacks con ese id" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const getFeedbacksFromEvent: any = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  try {
    const exists = await ThisEventExistsUsecase.call(Number(id));
    if (exists) {
      const result = await GetFeedbacksFromEventUsecase.call(Number(id));
      return result.length > 0
        ? res.json(result)
        : res.json({ msg: "Sin feedbacks con ese id" }).status(404);
    } else {
      return res.json({ msg: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ msg: "Error interno" });
  }
};

export const answerAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await AnswerAFeedbackUsecase.call(Number(id), answer);
      return result
        ? res.json({ msg: "Respuesta guardada" })
        : res.json({ msg: "Respuesta no guardada" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};

export const deleteAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await DeleteAFeedbackUsecase.call(Number(id));
      return result
        ? res.json({ msg: "Feedback eliminado" })
        : res.json({ msg: "Feedback no eliminado" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};

export const updateAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    eventid,
    comment,
    title,
    score,
    likes,
    dislikes,
    answer,
    feedbackid,
    answerDateTime
  } = req.body;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const feedback: Feedback = {
        eventid,
        comment,
        title,
        score,
        dateTime:new Date(Date.now()),
        likes,
        dislikes,
        answer,
        id: feedbackid,
        answerDateTime
      };
      const result = await UpdateAFeedbackUsecase.call(feedback, Number(id));
      return result
        ? res.json({ msg: "Feedback actualizado" })
        : res.json({ msg: "Feedback no actualizado" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};
export const makeAFeedback: any = async (req: Request, res: Response) => {
  const { eventid, comment, title, score, likes, dislikes, answer, answerDateTime } = req.body;
  try {
    let id;
    do {
      id = generateRandomId();
    } while (await ThisFeedbackExistsUsecase.call(id));

    const exists = await ThisEventExistsUsecase.call(eventid);
    if (exists) {
      const feedback: Feedback = {
        eventid,
        comment,
        title,
        score,
        dateTime: new Date(Date.now()),
        likes,
        dislikes,
        answer,
        id,
        answerDateTime
      };
      const result = await MakeAFeedbackUsecase.call(feedback);
      return result
        ? res.json({ msg: "Feedback registrado" })
        : res.json({ msg: "Feedback no registrado" });
    } else {
      return res.json({ msg: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};

export const likeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await LikeAFeedbackUsecase.call(Number(id));
      return result
        ? res.json({ msg: "Feedback likeado" })
        : res.json({ msg: "Feedback no likeado" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};
export const unLikeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await UnLikeAFeedbackUsecase.call(Number(id));
      return result
        ? res.json({ msg: "Feedback deslikeado" })
        : res.json({ msg: "Feedback no deslikeado" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};
export const dislikeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await DislikeAFeedbackUsecase.call(Number(id));
      return result
        ? res.json({ msg: "Feedback dislikeado" })
        : res.json({ msg: "Feedback no dislikeado" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};
export const unDislikeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await UnDislikeAFeedbackUsecase.call(Number(id));
      return result
        ? res.json({ msg: "Feedback desdislikeado" })
        : res.json({ msg: "Feedback no desdislikeado" });
    } else {
      return res.json({ msg: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ msg: "Error interno" });
  }
};
