import { Database } from "../DB/Database.js";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { ISpeaker } from "../Domain/Interfaces/ISpeaker.js";

export class Teller implements ISpeaker {
  Teller() {}
  async updateProfile(speaker: Speaker,email:string): Promise<boolean> {
    return await Database.update(email, "speakers", "email", speaker);
  }
  async deleteProfile(email: string): Promise<boolean> {
    return await Database.delete(email, "speakers", "email");
  }

  async makeAProfile(speaker: Speaker): Promise<boolean> {
    return await Database.register("speakers", speaker);
  }
}
