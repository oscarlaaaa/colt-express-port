"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ruleset = void 0;
const Action_1 = require("../../Action");
class Ruleset {
    constructor() {
        this._turnLimit = 60;
        this._trainPhases = 4;
        this._phaseTurns = 4;
        this._numTrainCars = 4;
        this._deckActionCounts = getDefaultDeck();
    }
    get turnLimit() {
        return this._turnLimit;
    }
    set turnLimit(limit) {
        if (limit < 5 || limit > 120)
            throw new Error("Turn limit must be between 5 and 120 seconds.");
        this._turnLimit = limit;
    }
    get trainPhases() {
        return this._trainPhases;
    }
    set trainPhases(phases) {
        if (phases < 1 || phases > 6)
            throw new Error("Phase count must be between 1 and 6.");
        this._trainPhases = phases;
    }
    get phaseTurns() {
        return this._phaseTurns;
    }
    set phaseTurns(turns) {
        if (turns < 1 || turns > 6)
            throw new Error("Phase turns must be between 1 and 6.");
        this._phaseTurns = turns;
    }
    get numTrainCars() {
        return this._numTrainCars;
    }
    set numTrainCars(cars) {
        if (cars < 1 || cars > 6)
            throw new Error("Number of train cars must be between 1 and 6.");
        this._numTrainCars = cars;
    }
    setDeckActionCount(actionType, count) {
        if (count < 0)
            throw new Error("Number of an action in the deck cannot be a negative number.");
        this._deckActionCounts.set(actionType, count);
    }
    // this function assumes that it's passed a valid JSON object
    static JSONToRuleset(json) {
        let ruleset = new Ruleset();
        try {
            ruleset.turnLimit = json.turnLimit;
            ruleset.trainPhases = json.trainPhases;
            ruleset.phaseTurns = json.phaseTurns;
            ruleset.numTrainCars = json.numTrainCars;
            const deckActionCountsObject = JSON.parse(json.deckActionCounts);
            Object.entries(deckActionCountsObject).forEach(x => {
                console.log(x);
            });
            const deckActionCountsMap = new Map(Object.entries(deckActionCountsObject));
        }
        catch (e) {
            // todo
            throw new Error("Invalid json object.");
        }
        return ruleset;
    }
}
exports.Ruleset = Ruleset;
function getDefaultDeck() {
    let deck = new Map();
    deck.set(Action_1.ActionType.MoveHorizontal, 2);
    deck.set(Action_1.ActionType.MoveVertical, 2);
    deck.set(Action_1.ActionType.Shoot, 2);
    deck.set(Action_1.ActionType.Loot, 2);
    deck.set(Action_1.ActionType.Sheriff, 1);
    deck.set(Action_1.ActionType.Punch, 1);
    return deck;
}
