import { Teller } from "../../../Implementations/Teller.js";
import { Speaker } from "../../Entities/Speaker.js";

export class UpdateAProfileUsecase{

   static async call(speaker:Speaker,email:string):Promise<boolean>{
        const teller = new Teller();
        return await teller.updateProfile(speaker, email);
    }
}