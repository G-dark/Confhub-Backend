import { Speaker } from "./Speaker.js"

export type Admin = Speaker & {
    rol: true | false
}