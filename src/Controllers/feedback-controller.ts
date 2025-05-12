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
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { UpdateReviewAvgScoreUsecase } from "../Domain/Usecases/EventUsecases/UpdateReviewScoresUseCase.js";


// inicializaciones necesarias
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, "../../ApiVersion.txt");

export const getFeedbacks: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await GetFeedbacksUsecase.call(Number(id));
    return result.length > 0
      ? res.json(result.map((feedback:any)=>{return transformToFeedback(feedback)}))
      : res.status(404).json({ error: "Sin feedbacks con ese id" }).status(404);
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
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
        ? res.json(result.map((feedback:any)=>{return transformToFeedback(feedback)}))
        : res.status(444).json({ error: "Sin feedbacks con ese id" }).status(404);
    } else {
      return res.status(404).json({ error: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("se obtuvo un error", error);
    res.status(500).json({ error: "Error interno" });
  }
};

export const answerAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { answer } = req.body;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await AnswerAFeedbackUsecase.call(Number(id), answer);

      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result
        ? res.json({ success: "Respuesta guardada", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Respuesta no guardada" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const deleteAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const feedback = (await GetFeedbacksUsecase.call(Number(id)))[0];
      const result = await DeleteAFeedbackUsecase.call(Number(id));
      const result2 = await UpdateReviewAvgScoreUsecase.call(feedback.eventid,-1);
      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result && result2
        ? res.json({ success: "Feedback eliminado", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Feedback no eliminado" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const updateAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {

      const toUpdateFeed = transformToFeedback((await GetFeedbacksUsecase.call(Number(id)))[0]);
      const feedback: Feedback = {
        ...toUpdateFeed,
        ...req.body,
        dateTime: new Date(Date.now()),
      };
      const result = await UpdateAFeedbackUsecase.call(feedback, Number(id));
      const result2 = await UpdateReviewAvgScoreUsecase.call(toUpdateFeed.eventid,0);
      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result && result2
        ? res.json({ success: "Feedback actualizado", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Feedback no actualizado" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
export const makeAFeedback: any = async (req: Request, res: Response) => {
  const {
    eventid,
    comment,
    title,
    score,
    answer,
    answerDateTime,
  } = req.body;
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
        likes:0,
        dislikes:0,
        answer,
        id,
        answerDateTime,
      };
      const result = await MakeAFeedbackUsecase.call(feedback);
      const result2 = await UpdateReviewAvgScoreUsecase.call(eventid,1);
      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result && result2
        ? res.json({ success: "Feedback registrado", apiVersion: ApiVersion, feedbackMade:result })
        : res.status(444).json({ error: "Feedback no registrado" });
    } else {
      return res.status(404).json({ error: "Ese evento no existe" });
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const likeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await LikeAFeedbackUsecase.call(Number(id));
      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result
        ? res.json({ success: "Feedback likeado", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Feedback no likeado" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
export const unLikeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await UnLikeAFeedbackUsecase.call(Number(id));

     const ApiVersion = await readFile(logFilePath, "utf-8");
      return result
        ? res.json({ success: "Feedback deslikeado", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Feedback no deslikeado" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
export const dislikeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await DislikeAFeedbackUsecase.call(Number(id));

      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result
        ? res.json({ success: "Feedback dislikeado", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Feedback no dislikeado" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
export const unDislikeAFeedback: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exists = await ThisFeedbackExistsUsecase.call(Number(id));
    if (exists) {
      const result = await UnDislikeAFeedbackUsecase.call(Number(id));
      const ApiVersion = await readFile(logFilePath, "utf-8");
      return result
        ? res.json({ success: "Feedback desdislikeado", apiVersion: ApiVersion })
        : res.status(444).json({ error: "Feedback no desdislikeado" });
    } else {
      return res.status(404).json({ error: "Ese feedback no existe" }).status(404);
    }
  } catch (error) {
    console.error("Se ha obtenido un error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

const transformToFeedback = (feedback:any):Feedback =>{

  return {
    id:Number(feedback.id_),
    eventid: feedback.eventid,
    comment:feedback.comment_,
    title:feedback.title,
    score:feedback.score,
    likes:feedback.likes,
    dislikes: feedback.dislikes,
    answer:feedback.answer,
    dateTime:feedback.datetime,
    answerDateTime:feedback.answerdatetime
  }

}
