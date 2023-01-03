import { ActionType } from "../../Action";

export class Ruleset {
    private _turnLimit: number = 60;
    private _trainPhases: number = 4;
    private _phaseTurns: number = 4;
    private _numTrainCars: number = 4;
    private _deckActionCounts: Map<ActionType, number>;

    constructor() {
        this._deckActionCounts = getDefaultDeck();
    }

    public get turnLimit(): number {
        return this._turnLimit;
    }
    
    public set turnLimit(limit: number) {
        if (limit < 5 || limit > 120)
            throw new Error("Turn limit must be between 5 and 120 seconds.");
        this._turnLimit = limit;
    }

    public get trainPhases(): number {
        return this._trainPhases;
    }
    
    public set trainPhases(phases: number) {
        if (phases < 1 || phases > 6)
            throw new Error("Phase count must be between 1 and 6.");
        this._trainPhases = phases;
    }

    public get phaseTurns(): number {
        return this._phaseTurns;
    }
    
    public set phaseTurns(turns: number) {
        if (turns < 1 || turns > 6)
            throw new Error("Phase turns must be between 1 and 6.");
        this._phaseTurns = turns;
    }

    public get numTrainCars(): number {
        return this._numTrainCars;
    }
    
    public set numTrainCars(cars: number) {
        if (cars < 1 || cars > 6)
            throw new Error("Number of train cars must be between 1 and 6.");
        this._numTrainCars = cars;
    }

    public get deckActionCounts(): Map<ActionType, number> {
        return this._deckActionCounts;
    }
    
    public setDeckActionCount(actionType: ActionType, count: number) {
        if (count < 0)
            throw new Error("Number of an action in the deck cannot be a negative number.");
        this._deckActionCounts.set(actionType, count);
    }

    // this function assumes that it's passed a valid JSON object
    static JSONToRuleset(json: any): Ruleset {
        let ruleset = new Ruleset();
        try {
            ruleset.turnLimit = json.turnLimit;
            ruleset.trainPhases = json.trainPhases;
            ruleset.phaseTurns = json.phaseTurns;
            ruleset.numTrainCars = json.numTrainCars;

            const deckActionCountsObject = JSON.parse(json.deckActionCounts);
            Object.entries(deckActionCountsObject).forEach(x => {
                console.log(x);
            })
            const deckActionCountsMap = new Map(Object.entries(deckActionCountsObject));
        } catch (e: any) {
            // todo
            throw new Error("Invalid json object.")
        }
                
        return ruleset;
    }

    public toString(): string {
        return JSON.stringify({
            turnLimit: this.turnLimit,
            trainPhase: this.trainPhases,
            phaseTurns: this.phaseTurns,
            numTrainCars: this.numTrainCars,
            deckActionCounts: JSON.stringify(Array.from(this.deckActionCounts.entries()))
        })
    }
}

function getDefaultDeck() {
    let deck = new Map<ActionType, number>();
    deck.set(ActionType.MoveHorizontal, 2);
    deck.set(ActionType.MoveVertical, 2);
    deck.set(ActionType.Shoot, 2);
    deck.set(ActionType.Loot, 2);
    deck.set(ActionType.Sheriff, 1);
    deck.set(ActionType.Punch, 1);
    return deck;
}