import { Track } from "../Entities/Track.js";

export interface ITrack{
    thisTrackExists(name:string):Promise<boolean>;
    makeATrack(track:Track):Promise<boolean>;
    updateATrack(track:Track, name:string):Promise<boolean>;
    deleteATrack(name:string):Promise<boolean>;
    getTracks(name:string):Promise<any>;
}