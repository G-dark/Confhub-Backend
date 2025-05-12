import { Boss } from "../../../Implementations/Boss.js";

export class ThisAdminExistsUsecase {
  static async call(email: string): Promise<boolean> {
    const boss = new Boss();
    return await boss.thisAccountExists(email);
  }
}
