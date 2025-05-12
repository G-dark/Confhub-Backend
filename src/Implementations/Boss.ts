import bcrypt from "bcryptjs";
import { Database } from "../DB/Database.js";
import { Admin } from "../Domain/Entities/Admin.js";
import { IAdmin } from "../Domain/Interfaces/IAdmin.js";
import { PEPPER, SALT_OR_ROUNDS } from "../App/config.js";

export class Boss implements IAdmin {
  Boss() {}
  async thisAccountExists(email: string): Promise<boolean> {
    return await Database.idExists(email, "admins", "email");
  }
  async getAccount(email: string): Promise<Admin> {
    return await Database.read(email, "admins", "email");
  }
  async loginProfile(email: string, password: string): Promise<boolean> {
    const admin = (await Database.read(email, "admins", "email"))[0];

    const isMatch = await bcrypt.compare(password + PEPPER, admin.passwrd);


    if (isMatch) {
      return true;
    } else {
      return false;
    }
  }
  async updateProfile(admin: Admin, email: string): Promise<boolean> {
    if (admin.password) {
      admin.password = await bcrypt.hash(
        admin.password + PEPPER,
        SALT_OR_ROUNDS
      );
    }
    return await Database.update(email, "admins", "email", admin);
  }
  async makeAProfile(admin: Admin): Promise<boolean> {
    admin.password = await bcrypt.hash(admin.password + PEPPER, SALT_OR_ROUNDS);
    return await Database.register("admins", admin);
  }
  async deleteProfile(email: string): Promise<boolean> {
    return await Database.delete(email, "speakers", "email");
  }
}
