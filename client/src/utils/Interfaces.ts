export interface MainScreen {
    state: any;
    setState(state: any): void;
    setIsDisplay(isDisplay: boolean): void;
}

export interface Back {
    back: () => void;
}

export interface Ruleset {
    turnLimit: number;
    trainPhases: number;
    phaseTurns: number;
    numTrainCars: number;
    deckActionCounts: any;
}