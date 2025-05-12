import { Teller } from "../../../Implementations/Teller.js";

export class LoginSpeakerUsecase {
  static async call(email: string, password: string): Promise<boolean> {
    const teller = new Teller();
    return await teller.loginProfile(email, password);
  }
}
