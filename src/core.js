import {List, Map} from 'immutable';

export function slate(state, candidates) {
    return state.set('candidates', List(candidates));
}

export function vote(state, ballot) {
   return state.update('ballots', ballots => ballots.push(List(ballot))); 
}

export function tally(state) {
    let result = Map([]);
    state.get('ballots').forEach(ballot => {
      ballot.forEach(name => {
          if (state.get('ballots').indexOf(name)) {
            result = result.updateIn([name],0,total => total + 1);
            return false;
          }
      });
    });
    return state.set('result', result);
}

export function pick(state){
    let result = state.get('result');
    let totalVotes = result.reduce((sum, val) => sum + val);
    let winner = List(result.filter(votes => votes >= (totalVotes/2)).keys());

    if(winner.size > 0){
        return state.update('winner', () => winner);
    } else {
        let minimumVotes = result.min();
        let slate = state.get('candidates');
        let newSlate = slate.filter(name => result.get(name) > minimumVotes);
        return state.update('candidates', () => newSlate);
    }
}
