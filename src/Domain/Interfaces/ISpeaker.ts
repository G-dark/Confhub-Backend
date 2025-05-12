import { myEvent } from "../Entities/Event.js";
import { Speaker } from "../Entities/Speaker.js";

export interface ISpeaker{

    updateProfile(speaker:Speaker,email:string): Promise<boolean>;
    makeAProfile(speaker:Speaker):Promise<boolean>;
    deleteProfile(email:string):Promise<boolean>;
    loginProfile(email:string, password:string):Promise<boolean>;
    thisAccountExists(email:string):Promise<boolean>;
    getAccount(email:string):Promise<Speaker>;


}