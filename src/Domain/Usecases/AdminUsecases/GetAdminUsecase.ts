import { Boss } from "../../../Implementations/Boss.js";
import { Admin } from "../../Entities/Admin.js";

export class GetAdminUsecase{

   static async call(email:string):Promise<Admin>{
        const boss = new Boss();
        return await boss.getAccount(email);
    }
}