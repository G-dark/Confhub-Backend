import { Teller } from "../../../Implementations/Teller.js";
import { Speaker } from "../../Entities/Speaker.js";

export class GetSpeakerUsecase{

   static async call(email:string):Promise<Speaker>{
        const teller = new Teller();
        return await teller.getAccount(email);
    }
}