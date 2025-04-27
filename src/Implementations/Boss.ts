import { Database } from "../DB/Database.js";
import { Admin } from "../Domain/Entities/Admin.js";
import { myEvent } from "../Domain/Entities/Event.js";
import { Speaker } from "../Domain/Entities/Speaker.js";
import { IAdmin } from "../Domain/Interfaces/IAdmin.js";

export class Boss implements IAdmin {
  Boss() {}

  async updateProfile(admin: Admin, email: string): Promise<boolean> {
    return await Database.update(email, "admins", "email", admin);
  }
  async makeAProfile(admin: Admin): Promise<boolean> {
    return await Database.register("admins", admin);
  }
  async deleteProfile(email: string): Promise<boolean> {
    return await Database.delete(email, "speakers", "email");
  }

}
