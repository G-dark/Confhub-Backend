import { Database } from "../DB/Database.js";

import { myEvent } from "../Domain/Entities/Event.js";
import { Track } from "../Domain/Entities/Track.js";
import { ITrack } from "../Domain/Interfaces/ITrack.js";

export class TrackEvent implements ITrack {
  Category() {}
  async thisTrackExists(name:string): Promise<boolean> {
   return await Database.idExists(name, "tracks", "name");
  }
  async makeATrack(track: Track): Promise<boolean> {
     return await Database.register("tracks", track);
  }
  async updateATrack(track: Track, name: string): Promise<boolean> {
    return await Database.update(name, "tracks", "name", track);
  }
  async deleteATrack(name: string): Promise<boolean> {
    return await Database.delete(name, "tracks", "name");
  }
  async getTracks(name: string): Promise<any> {
    return await Database.read(name, "tracks", "name");
  }
}
