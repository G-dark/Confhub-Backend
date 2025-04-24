import { Speaker } from "../Entities/Speaker.js";
import { ISpeaker } from "./ISpeaker.js";

export interface IAdmin extends ISpeaker{
    deleteProfile(speaker:Speaker): boolean;
}