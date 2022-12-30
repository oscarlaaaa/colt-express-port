import { Player } from "./Player";

export enum ActionType {
    Shoot = "SHOOT",
    MoveHorizontal = "MOVE_HORIZONTAL",
    MoveVertical = "MOVE_VERTICAL",
    Punch = "PUNCH",
    Loot = "LOOT",
    Sheriff = "SHERIFF"
}

export class Action {}