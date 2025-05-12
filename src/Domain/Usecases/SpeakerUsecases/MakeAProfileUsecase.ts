import { Teller } from "../../../Implementations/Teller.js";
import { Speaker } from "../../Entities/Speaker.js";

export class MakeAProfileUsecase{

   static async call(speaker:Speaker):Promise<boolean>{
        const teller = new Teller();
        return await teller.makeAProfile(speaker);
    }
}