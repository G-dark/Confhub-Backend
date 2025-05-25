import bcrypt from "bcryptjs";
import { Database } from "../DB/Database.js";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { ISpeaker } from "../Domain/Interfaces/ISpeaker.js";
import { PEPPER, SALT_OR_ROUNDS } from "../App/config.js";

export class Teller implements ISpeaker {
  Teller() {}
  async loginProfile(email: string, password: string): Promise<boolean> {
    const speaker = (await Database.read("speakers", "email",email))[0];

    const isMatch = await bcrypt.compare(password + PEPPER, speaker.passwrd);

    if (isMatch) {
      return true;
    } else {
      return false;
    }
  }
  async thisAccountExists(email: string): Promise<boolean> {
    return await Database.idExists(email, "speakers", "email");
  }
  async getAccount(email: string): Promise<Speaker> {

    return await Database.readSpeaker(email);
  }
  async updateProfile(speaker: Speaker, email: string): Promise<boolean> {
    if (speaker.password) {
      speaker.password = await bcrypt.hash(
        speaker.password + PEPPER,
        SALT_OR_ROUNDS
      );
    }
    return await Database.update(email, "speakers", "email", speaker);
  }
  async deleteProfile(email: string): Promise<boolean> {
    return await Database.delete(email, "speakers", "email");
  }

  async makeAProfile(speaker: Speaker): Promise<boolean> {
    speaker.password = await bcrypt.hash(
       speaker.password + PEPPER,
      SALT_OR_ROUNDS
    );
    return await Database.register("speakers", speaker);
  }
}
