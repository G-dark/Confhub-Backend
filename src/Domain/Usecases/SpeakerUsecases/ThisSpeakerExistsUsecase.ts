import { Teller } from "../../../Implementations/Teller.js";

export class ThisSpeakerExistsUsecase {
  static async call(email: string): Promise<boolean> {
    const teller = new Teller();
    return await teller.thisAccountExists(email);
  }
}
