import { Admin } from "../Entities/Admin.js";
import { Speaker } from "../Entities/Speaker.js";
import { ISpeaker } from "./ISpeaker.js";

export interface IAdmin extends ISpeaker{
    updateProfile(admin:Admin,email:string): Promise<boolean>;
    makeAProfile(admin:Admin):Promise<boolean>;
}