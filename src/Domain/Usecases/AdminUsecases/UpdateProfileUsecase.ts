import { Boss } from "../../../Implementations/Boss.js";
import { Admin } from "../../Entities/Admin.js";

export class UpdateProfileUsecase{

   static async call(admin:Admin,email:string):Promise<boolean>{
        const boss = new Boss();
        return await boss.updateProfile(admin, email);
    }
}