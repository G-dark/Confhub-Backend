import { pool } from "../App/config.js";
import { Admin } from "../Domain/Entities/Admin.js";
import { myEvent } from "../Domain/Entities/Event.js";
import { Feedback } from "../Domain/Entities/Feedback.js";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { Track } from "../Domain/Entities/Track.js";

export class Database {
  static register(table: string, updated: myEvent): Promise<any>;

  static register(table: string, registered: Feedback): Promise<any>;

  static register(table: string, registered: Speaker): Promise<any>;

  static register(table: string, registered: Admin): Promise<any>;

  static register(table: string, registered: Track): Promise<any>;

  static async register(
    table: string,
    registered: myEvent | Feedback | Speaker | Admin | Track
  ): Promise<any> {
    let result;
    if ("attendees" in registered) {
      const query = {
        text: `insert into ${table}(eventid, title, description,
              attendees,avgScore, availableSpots, category,
              dateTime,location_,numberReviews, sessionOrder,
              speakerAvatar,speakerName,status,tags, user_info, track)
              values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,

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
          registered.user_info,
          registered.track
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
        text: `insert into ${table} (firstname,lastname,email,events,passwrd,image, id_image)
          values($1, $2, $3, $4, $5, $6, $7)`,

        values: [
          registered.firstName,
          registered.lastName,
          registered.email,
          registered.events,
          registered.password,
          registered.image,
          registered.id_image
        ],
      };
      result = await pool.query(query);
    }

    if ("rol" in registered) {
      const query = {
        text: `insert into ${table} (firstname,lastname,email,events,passwrd,rol,image,id_image)
            values($1, $2, $3, $4, $5, $6, $7, $8)`,

        values: [
          registered.firstName,
          registered.lastName,
          registered.email,
          registered.events,
          registered.password,
          registered.rol,
          registered.image,
          registered.id_image
        ],
      };
      result = await pool.query(query);
    }

    if (
      "name" in registered &&
      "description" in registered &&
      "events" in registered
    ) {
      const query = {
        text: `insert into ${table} (name,description,events)
            values($1, $2, $3)`,

        values: [registered.name, registered.description, registered.events],
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

  static update(
    id: number | string,
    table: string,
    fieldName: string,
    updated: Track
  ): Promise<any>;

  static async update(
    id: number | String,
    table: String,
    fieldName: String,
    updated: myEvent | Feedback | Speaker | Admin | Track
  ): Promise<any> {
    let result;

    if ("attendees" in updated) {
      const query = {
        text: `update ${table} SET eventid = $1, title = $2, description= $3,
            attendees = $4,avgScore = $5, availableSpots = $6, category=$7,
            dateTime=$8,location_=$9,numberReviews=$10, sessionOrder = $11,
            speakerAvatar=$12,speakerName=$13,status=$14,tags=$15, user_info=$16, track=$17 where ${fieldName} = $18`,

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
          updated.user_info,
          updated.track,
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
        text: updated.password
          ? `update ${table} SET firstname = $1, lastname = $2, email= $3,
            events = $4,passwrd = $5, image = $6, id_image = $7 where ${fieldName} = $8`
          : `update ${table} SET firstname = $1, lastname = $2, email= $3,
            events = $4, image = $5, id_image = $6 where ${fieldName} = $7`,

        values: updated.password
          ? [
              updated.firstName,
              updated.lastName,
              updated.email,
              updated.events,
              updated.password,
              updated.image,
              updated.id_image,
              id,
            ]
          : [
              updated.firstName,
              updated.lastName,
              updated.email,
              updated.events,
              updated.image,
              updated.id_image,
              id,
            ],
      };
      result = await pool.query(query);
    }

    if ("rol" in updated) {
      const query = {
        text: updated.password
          ? `update ${table} SET firstname = $1, lastname = $2, email= $3,
            events = $4,passwrd = $5, rol = $6, image = $7, id_image = $8 where ${fieldName} = $9`
          : `update ${table} SET firstname = $1, lastname = $2, email= $3,
            events = $4, rol = $5, image = $6, id_image = $7 where ${fieldName} = $8`,

        values: updated.password
          ? [
              updated.firstName,
              updated.lastName,
              updated.email,
              updated.events,
              updated.password,
              updated.rol,
              updated.image,
              updated.id_image,
              id,
            ]
          : [
              updated.firstName,
              updated.lastName,
              updated.email,
              updated.events,
              updated.rol,
              updated.image,
              updated.id_image,
              id,
            ],
      };
      result = await pool.query(query);
    }

    if ("name" in updated && "description" in updated && "events" in updated) {
      const query = {
        text: `update ${table} set name=$1, description=$2, events=$3 where ${fieldName}=$4`,

        values: [updated.name, updated.description, updated.events, id],
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

    return !!(await pool.query(query));
  };

  static read: any = async (
    table: string,
    fieldName: string,
    id?: number | string
  ) => {
    const query = id
      ? { text: `select * from ${table} where ${fieldName} = $1`, values: [id] }
      : { text: `select * from ${table}` };

    const result = await pool.query(query);

    return result.rows;
  };

  static readAdmin: any = async (id: number | string) => {
    const query = {
      text: `select firstname, lastname, email, rol, events, image, id_image from admins where email = $1`,
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  };

  static readSpeaker: any = async (id: number | string) => {
    const query = {
      text: `select firstname, lastname, email, events, image, id_image from speakers where email = $1`,
      values: [id],
    };

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
    const rows = await this.read(table, fieldName, id);
    return rows.length > 0;
  };
}
