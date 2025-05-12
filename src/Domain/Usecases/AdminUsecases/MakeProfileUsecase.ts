import { Boss } from "../../../Implementations/Boss.js";
import { Admin } from "../../Entities/Admin.js";

export class MakeProfileUsecase{

   static async call(admin:Admin):Promise<boolean>{
        const boss = new Boss();
        return await boss.makeAProfile(admin);
    }
}