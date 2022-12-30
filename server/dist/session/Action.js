"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.ActionType = void 0;
var ActionType;
(function (ActionType) {
    ActionType["Shoot"] = "SHOOT";
    ActionType["MoveHorizontal"] = "MOVE_HORIZONTAL";
    ActionType["MoveVertical"] = "MOVE_VERTICAL";
    ActionType["Punch"] = "PUNCH";
    ActionType["Loot"] = "LOOT";
    ActionType["Sheriff"] = "SHERIFF";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
class Action {
}
exports.Action = Action;
