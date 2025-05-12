import { pool } from "../App/config.js";
import { Admin } from "../Domain/Entities/Admin.js";
import { myEvent } from "../Domain/Entities/Event.js";
import { Feedback } from "../Domain/Entities/Feedback.js";
import { Speaker } from "../Domain/Entities/Speaker.js";

export class Database {
  static register(table: string, updated: myEvent): Promise<any>;

  static register(table: string, registered: Feedback): Promise<any>;

  static register(table: string, registered: Speaker): Promise<any>;

  static register(table: string, registered: Admin): Promise<any>;

  static async register(
    table: string,
    registered: myEvent | Feedback | Speaker | Admin
  ): Promise<any> {
    let result;
    if ("attendees" in registered) {
      const query = {
        text: `insert into ${table}(eventid, title, description,
              attendees,avgScore, availableSpots, category,
              dateTime,location_,numberReviews, sessionOrder,
              speakerAvatar,speakerName,status,tags)
              values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,

        values: [
          registered.eventid,
          registered.title,
          registered.description,
          registered.attendees,
          registered.avgScore,
          registered.availableSpots,
          registered.category,
          registered.dateTime.toISOString(),
          registered.location,
          registered.numberReviews,
          JSON.stringify(registered.sessionOrder),
          registered.speakerAvatar,
          registered.speakerName,
          registered.status,
          registered.tags,
        ],
      };
      result = await pool.query(query);
    }

    if ("comment" in registered && "score" in registered) {
      const query = {
        text: `insert into ${table} (eventid, title, comment_,
              id_,score, likes, dislikes, dateTime)
               values($1,$2,$3,$4,$5,$6,$7,$8)`,

        values: [
          registered.eventid,
          registered.title,
          registered.comment,
          registered.id,
          registered.score,
          registered.likes,
          registered.dislikes,
          registered.dateTime.toISOString(),
        ],
      };
      result = await pool.query(query);
    }

    if (!("rol" in registered) && "firstName" in registered) {
      const query = {
        text: `insert into ${table} (firstname,lastname,email,events,passwrd,image)
          values($1, $2, $3, $4, $5, $6)`,

        values: [
          registered.firstName,
          registered.lastName,
          registered.email,
          registered.events,
          registered.password,
          registered.image,
        ],
      };
      result = await pool.query(query);
    }

    if ("rol" in registered) {
      const query = {
        text: `insert into ${table} (firstname,lastname,email,events,passwrd,rol,image)
            values($1, $2, $3, $4, $5, $6, $7)`,

        values: [
          registered.firstName,
          registered.lastName,
          registered.email,
          registered.events,
          registered.password,
          registered.rol,
          registered.image
        ],
      };
       result = await pool.query(query);
    }
    return !!result;
  }

  static update(
    id: number | string,
    table: string,
    fieldName: string,
    updated: myEvent
  ): Promise<any>;

  static update(
    id: Number | String,
    table: String,
    fieldName: String,
    updated: Feedback
  ): Promise<any>;

  static update(
    id: number | string,
    table: string,
    fieldName: string,
    updated: Speaker
  ): Promise<any>;

  static update(
    id: number | string,
    table: string,
    fieldName: string,
    updated: Admin
  ): Promise<any>;

  static async update(
    id: number | String,
    table: String,
    fieldName: String,
    updated: myEvent | Feedback | Speaker | Admin
  ): Promise<any> {
    let result;

    if ("attendees" in updated) {
      const query = {
        text: `update ${table} SET eventid = $1, title = $2, description= $3,
            attendees = $4,avgScore = $5, availableSpots = $6, category=$7,
            dateTime=$8,location_=$9,numberReviews=$10, sessionOrder = $11,
            speakerAvatar=$12,speakerName=$13,status=$14,tags=$15 where ${fieldName} = $16`,

        values: [
          updated.eventid,
          updated.title,
          updated.description,
          updated.attendees,
          updated.avgScore,
          updated.availableSpots,
          updated.category,
          updated.dateTime.toISOString(),
          updated.location,
          updated.numberReviews,
          JSON.stringify(updated.sessionOrder),
          updated.speakerAvatar,
          updated.speakerName,
          updated.status,
          updated.tags,
          id,
        ],
      };
      result = await pool.query(query);
    }

    if ("comment" in updated && "score" in updated) {
      const query = {
        text: `update ${table} SET eventid = $1, title = $2, comment_= $3,
            id_ = $4,score = $5, likes = $6, dislikes=$7,
            dateTime=$8 where ${fieldName} = $9`,

        values: [
          updated.eventid,
          updated.title,
          updated.comment,
          updated.id,
          updated.score,
          updated.likes,
          updated.dislikes,
          updated.dateTime.toISOString(),
          id,
        ],
      };
      result = await pool.query(query);
    }

    if (!("rol" in updated) && "firstName" in updated) {
      const query = {
        text: `update ${table} SET firstname = $1, lastname = $2, email= $3,
            events = $4,passwrd = $5, image = $6 where ${fieldName} = $7`,

        values: [
          updated.firstName,
          updated.lastName,
          updated.email,
          updated.events,
          updated.password,
          updated.image,
          updated.email,
        ],
      };
      result = await pool.query(query);
    }

    if ("rol" in updated) {
      const query = {
        text: `update ${table} SET firstname = $1, lastname = $2, email= $3,
            events = $4,passwrd = $5, rol = $6, image = $7 where ${fieldName} = $8`,

        values: [
          updated.firstName,
          updated.lastName,
          updated.email,
          updated.events,
          updated.password,
          updated.rol,
          updated.image,
          updated.email,
        ],
      };
      result = await pool.query(query);
    }

    return !!result;
  }

  static updateAField: any = async (
    table: string,
    fieldName: string,
    fieldName2: string,
    value: string | number | Object,
    id: string | number
  ) => {
    const query = {
      text: `update ${table} SET ${fieldName} = $1 WHERE ${fieldName2} = $2`,
      values: [value, id],
    };

    return !!(await pool.query(query))
  };

  static read: any = async (
    id: number | string,
    table: string,
    fieldName: string
  ) => {
    const query = id
      ? { text: `select * from ${table} where ${fieldName} = $1`, values: [id] }
      : { text: `select * from ${table}` };

    const result = await pool.query(query);

    return result.rows;
  };

  static delete: any = async (
    id: number | string,
    table: string,
    fieldName: string
  ) => {
    const query = {
      text: `delete from ${table} where ${fieldName} = $1`,
      values: [id],
    };

    const result = await pool.query(query);

    return !!result;
  };

  static idExists: any = async (
    id: number | string,
    table: string,
    fieldName: string
  ) => {
    const rows = await this.read(id, table, fieldName);
    return rows.length > 0;
  };
}
