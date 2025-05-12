import { Boss } from "../../../Implementations/Boss.js";

export class LoginAdminUsecase {
  static async call(email: string, password: string): Promise<boolean> {
    const boss = new Boss();
    return await boss.loginProfile(email, password);
  }
}
