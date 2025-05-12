import { Boss } from "../../../Implementations/Boss.js";

export class DeleteProfileUsecase{

   static async call(email:string):Promise<boolean>{
        const boss = new Boss();
        return await boss.deleteProfile(email);
    }
}