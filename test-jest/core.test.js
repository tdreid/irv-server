import {List, Map} from 'immutable';
import {slate, vote, tally, pick} from '../src/core';

describe('immutable objects',()=>{
  it('imported to test suite and just work',()=>{
    let li = List.of(1,3);
    expect(li.size).toBe(2);
  });
});

describe('application logic', () => {
    
    describe('slate', () => {
        it('adds a list of candidates', () => {
            const state = Map();
            const candidates = List.of('Adams', 'Pinckney', 'Ellsworth');
            const nextState = slate(state, candidates);
            expect(nextState).toEqual(Map({
                candidates: List.of('Adams', 'Pinckney', 'Ellsworth')
            }));
        });
        
        it('converts input to immutable List', () => {
            const state = Map();
            const candidates = ['Adams', 'Pinckney', 'Ellsworth'];
            const nextState = slate(state, candidates);
            expect(nextState).toEqual(Map({
                candidates: List.of('Adams', 'Pinckney', 'Ellsworth')
            }));
        });
    });
    
    describe('vote', () => {
       
       it('adds a ballot', () => {
           const state = Map({
               ballots: List()
           });
       
           const ballot1 = ['Adams', 'Pinckney', 'Ellsworth'];
           const ballot2 = ['Ellsworth','Pinckney','Adams'];
           
           const nextState = vote(state, ballot1);
           const finalState = vote(nextState, ballot2);

           expect(finalState).toEqual(Map({
               ballots: List.of(
                    List.of('Adams', 'Pinckney', 'Ellsworth'),
                    List.of('Ellsworth','Pinckney','Adams')
                )
            }));
       });
       
        it('converts input to immutable List', () => {
           const state = Map({
               ballots: List()
           });
            const ballot = ['Mars', 'Venus', 'Earth'];
            const nextState = vote(state, ballot);
            expect(nextState).toEqual(Map({
               ballots: List.of(
                    List.of('Mars', 'Venus', 'Earth')
                )
            }));
        });
       
    });
    
    describe('tally', () => {
        it('counts the preferred candidate on each ballot', () => {
            const state = Map({
                candidates: List.of('Adams', 'Pinckney', 'Ellsworth'),
                ballots: List.of(
                    List.of('Adams','Pinckney','Ellsworth'),
                    List.of('Adams','Pinckney','Ellsworth'),                    
                    List.of('Adams','Ellsworth','Pinckney'),                    
                    List.of('Adams','Pinckney','Ellsworth'),                    
                    List.of('Pinckney','Ellsworth','Adams'),
                    List.of('Pinckney','Ellsworth','Adams'),
                    List.of('Ellsworth','Pinckney','Adams'),
                    List.of('Ellsworth','Adams','Pinckney'),
                    List.of('Ellsworth','Adams','Pinckney')
                )
            });
            
            const nextState = tally(state);
            expect(nextState.get('result')).toBe(Map({'Adams':4,'Ellsworth':3, 'Pinckney':2}));
        });
    });

    describe('pick', () => {
        it('removes the least popular loser if there is no winner', () => {
            const state = Map({
                candidates: List.of('Adams', 'Pinckney', 'Ellsworth'),
                ballots: List.of(
                    List.of('Adams','Pinckney','Ellsworth'),
                    List.of('Adams','Pinckney','Ellsworth'),                    
                    List.of('Adams','Ellsworth','Pinckney'),                    
                    List.of('Adams','Pinckney','Ellsworth'),                    
                    List.of('Pinckney','Ellsworth','Adams'),
                    List.of('Pinckney','Ellsworth','Adams'),
                    List.of('Ellsworth','Pinckney','Adams'),
                    List.of('Ellsworth','Adams','Pinckney'),
                    List.of('Ellsworth','Adams','Pinckney')
                )
            });
            
            const nextState = pick(tally(state));
            expect(nextState.get('candidates')).toEqual(List.of('Adams','Ellsworth'));
        });
        
        it('removes all the least popular if there is a tie', () => {
            const state = Map({
                candidates: List.of('Adams', 'Pinckney', 'Ellsworth'),
                ballots: List.of(
                    List.of('Adams','Pinckney','Ellsworth', 'Jefferson'),
                    List.of('Adams','Pinckney','Ellsworth', 'Jefferson'),
                    List.of('Adams','Pinckney','Ellsworth', 'Jefferson'),                    
                    List.of('Pinckney','Ellsworth', 'Jefferson', 'Adams'),
                    List.of('Pinckney','Ellsworth', 'Jefferson', 'Adams'),
                    List.of('Ellsworth', 'Jefferson','Adams','Pinckney'),
                    List.of('Ellsworth', 'Jefferson','Adams','Pinckney')
                )
            });
            const nextState = pick(tally(state));
            expect(nextState.get('candidates')).toEqual(List.of('Adams'));
        });
        
        it('declares a candidate with a majority the winner', () => {
            const state = Map({
                candidates: List.of('Adams', 'Pinckney', 'Ellsworth'),
                ballots: List.of(
                    List.of('Adams','Pinckney','Ellsworth'),
                    List.of('Adams','Pinckney','Ellsworth'),                    
                    List.of('Adams','Ellsworth','Pinckney'),                    
                    List.of('Adams','Pinckney','Ellsworth'),                    
                    List.of('Adams','Ellsworth','Pinckney'),
                    List.of('Pinckney','Ellsworth','Adams'),
                    List.of('Ellsworth','Pinckney','Adams'),
                    List.of('Ellsworth','Adams','Pinckney'),
                    List.of('Ellsworth','Pinckney','Adams')
                )
            });
            const nextState = pick(tally(state));
            expect(nextState.get('winner')).toEqual(List.of('Adams')); 
        });
        
        it('declares a tie if there is a tie for majority', () => {
            const state = Map({
                candidates: List.of('Adams','Pinckney','Ellsworth'),
                ballots: List.of(
                    List.of('Adams','Pinckney','Ellsworth'),
                    List.of('Adams','Pinckney','Ellsworth'),
                    List.of('Pinckney','Adams','Ellsworth'),
                    List.of('Pinckney','Adams','Ellsworth')
                )
            });
            const nextState = pick(tally(state));
            expect(nextState.get('winner')).toEqual(List.of('Adams','Pinckney'));
        });        
    });    
});