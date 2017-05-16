import {Map, List} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer.js';

describe('reducer', () => {
    it('handles SLATE', () => {
        const initialState = Map();
        const action = {type:'SLATE', candidates:['Venus','Earth', 'Mars']};
        const nextState = reducer(initialState, action);
        
        expect(nextState.get('candidates')).to.equal(List.of('Venus','Earth', 'Mars'));
    });
    
    it('handles VOTE', () => {
        const initialState = Map({
            ballots:List([])
        });
        const action = {type:'VOTE', ballot:['Venus']};
        const nextState = reducer(initialState, action);
        
        expect(nextState.get('ballots')).to.equal(List.of(List.of('Venus')));
    });    
    
    it('handles TALLY', () => {
        const initialState = Map({
            ballots:List.of(
                List.of('Mars'),
                List.of('Mars'),
                List.of('Mars')
            ),
            candidates:List.of('Mars','Earth','Venus')
        });
        const action = {type:'TALLY'};
        const nextState = reducer(initialState, action);

        expect(nextState.get('result')).to.equal(Map({'Mars':3}));
    });    
    
    it('handles PICK', () => {
        const initialState = Map({
            result:Map({
                'Mars':3
            })
        });
        const action = {type:'PICK'};
        const nextState = reducer(initialState, action);

        expect(nextState.get('winner')).to.equal(List.of('Mars'));
    });
    
    it('has an initial state', () => {
        const action = {type: 'SLATE', candidates: ['Venus', 'Pluto', 'Jupiter']};
        const nextState = reducer(undefined, action);
        expect(nextState.get('candidates')).to.equal(List.of('Venus','Pluto','Jupiter'));
    });    
    
    it('is reducible',() => {
        const actions =[
            {type: 'SLATE', candidates: ['Steve', 'Paige', 'Erika', 'Paige']},
            {type: 'VOTE', ballot:['Steve']},
            {type: 'VOTE', ballot:['Steve']},
            {type: 'VOTE', ballot:['Roy']},
            {type: 'VOTE', ballot:['Roy']},
            {type: 'VOTE', ballot:['Erika']},
            {type: 'VOTE', ballot:['Erika']},
            {type: 'VOTE', ballot:['Erika']},
            {type: 'VOTE', ballot:['Steve']},
            {type: 'VOTE', ballot:['Paige']},
            {type: 'VOTE', ballot:['Steve']},
            {type: 'VOTE', ballot:['Paige']},
            {type: 'TALLY'},
            {type: 'PICK'}            
        ];
        const finalState = actions.reduce(reducer, Map());
        expect(finalState.get('candidates')).to.equal(List.of('Steve', 'Erika'));
    });
});
