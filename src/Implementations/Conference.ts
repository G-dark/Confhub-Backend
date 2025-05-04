import { IEvent } from "../Domain/Interfaces/IEvent.js";
import { Database } from "../DB/Database.js";
import { dateToString } from "../Utils/tools.js";
import { myEvent } from "../Domain/Entities/Event.js";

export class Conference implements IEvent {
  Conference() {}

  async updateReviewAvgScore(
    eventid: number,
    action: -1 | 0 | 1
  ): Promise<boolean> {
    const event = (await Database.read(eventid, "events", "eventid"))[0];
    const result1 = await Database.updateAField(
      "events",
      "numberreviews",
      "eventid",
      event.numberreviews + action,
      eventid
    );
    const feedbacks = await Database.read(eventid, "feedbacks", "eventid");

    const scoresSum = feedbacks
      .map((feedback: any) => {
        return feedback.score;
      })
      .reduce((acumulado: number, actual: number) => {
        return acumulado + actual;
      });

    const avgScore = scoresSum / (event.numberreviews + action);

    console.log(avgScore, event.numberreviews + action, action, event)
    const result2 = await Database.updateAField(
      "events",
      "avgscore",
      "eventid",
      avgScore,
      eventid
    );

    return result1 && result2;
  }
  async thisEventExists(eventid: number): Promise<boolean> {
    return await Database.idExists(eventid, "events", "eventid");
  }
  async makeAnEvent(event: myEvent): Promise<boolean> {
    return await Database.register("events", event);
  }
  async updateAnEvent(event: myEvent, eventid: number): Promise<boolean> {
    return await Database.update(eventid, "events", "eventid", event);
  }
  async deleteAnEvent(eventid: number): Promise<boolean> {
    return await Database.delete(eventid, "events", "eventid");
  }
  async getEvents(eventid: number): Promise<any> {
    return await Database.read(eventid, "events", "eventid");
  }

  async suscribeToAnEvent(eventid: number): Promise<boolean> {
    const event = (await Database.read(eventid, "events", "eventid"))[0];
    const result1 = await Database.updateAField(
      "events",
      "attendees",
      "eventid",
      event.attendees + 1,
      eventid
    );
    const result2 = await Database.updateAField(
      "events",
      "availableSpots",
      "eventid",
      event.availablespots - 1,
      eventid
    );

    return result1 && result2;
  }
  async unSuscribeFromAnEvent(eventid: number): Promise<boolean> {
    const event = (await Database.read(eventid, "events", "eventid"))[0];

    const result1 = await Database.updateAField(
      "events",
      "attendees",
      "eventid",
      event.attendees - 1,
      eventid
    );
    const result2 = await Database.updateAField(
      "events",
      "availableSpots",
      "eventid",
      event.availablespots + 1,
      eventid
    );

    return result1 && result2;
  }
}
