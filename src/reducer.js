import {slate, vote, tally, pick} from './core';

export default function reducer(state, action){
    switch (action.type) {
        case 'SLATE':
            return slate(state, action.candidates);
        case 'VOTE':
            return vote(state, action.ballot);
        case 'TALLY':
            return tally(state);
        case 'PICK':
            return pick(state);            
    }
    return state
}