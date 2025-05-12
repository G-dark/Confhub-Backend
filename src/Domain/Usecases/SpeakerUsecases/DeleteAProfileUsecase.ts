import { Teller } from "../../../Implementations/Teller.js";

export class DeleteAProfileUsecase{

   static async call(email:string):Promise<boolean>{
        const teller = new Teller();
        return await teller.deleteProfile(email);
    }
}