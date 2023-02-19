import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Ruleset } from '../../utils/Interfaces';



const EditRuleset: React.FC<any> = (props: {rules: Ruleset, submitNewRuleset: Function, finishEditing: Function}) => {
    const [turnLimit, setTurnLimit] = useState<number>(props.rules['turnLimit']);
    const [trainPhases, setTrainPhases] = useState<number>(props.rules['trainPhases']);
    const [phaseTurns, setPhaseTurns] = useState<number>(props.rules['phaseTurns']);
    const [numTrainCars, setnumTrainCars] = useState<number>(props.rules['numTrainCars']);

    function submit(e: any) {
        e.preventDefault();
        const rules = {
            turnLimit: turnLimit,
            trainPhases: trainPhases,
            phaseTurns: phaseTurns,
            numTrainCars: numTrainCars
        };
        props.submitNewRuleset(rules);
        props.finishEditing();
    }

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formTurnLimit">
                <Form.Label>Turn Limit</Form.Label>
                <Form.Control type="number" value={turnLimit} min={5} max={120} onChange={(e) => setTurnLimit(parseInt(e.target.value))}  />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTurnLimit">
                <Form.Label>Train Phase</Form.Label>
                <Form.Control type="number" value={trainPhases} min={1} max={6} onChange={(e) => setTrainPhases(parseInt(e.target.value))} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTurnLimit">
                <Form.Label>Phase Turns</Form.Label>
                <Form.Control type="number" value={phaseTurns} min={1} max={6} onChange={(e) => setPhaseTurns(parseInt(e.target.value))} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTurnLimit">
                <Form.Label>Number of Traincars</Form.Label>
                <Form.Control type="number" value={numTrainCars} min={1} max={6} onChange={(e) => setnumTrainCars(parseInt(e.target.value))} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTurnLimit">
                <Form.Label>Deck Action Counts</Form.Label>
                {/* <Form.Control type="number" placeholder="2" value={rules.turnLimit} /> */}
            </Form.Group>
            <Button variant="primary" type="submit" onClick={(e) => submit(e)}>
                Submit
            </Button>
        </Form>
    )
}

export default EditRuleset