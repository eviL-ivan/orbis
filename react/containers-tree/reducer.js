import {SET_NODES_STATE, SET_NODE_STATE, SET_INIT_STATES} from './actions';

export const initialState = {
    rootNodeId: null,
    states:[]
};

const getStateById = (id, states) => {
    return states.filter(s => {
        return s.id === id;
    })[0];
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_INIT_STATES: {
            return {...state, ...action.payload}
        }
        case SET_NODES_STATE: {
            const newState = {...state};
            let newNodeState;
            newState.states.forEach((nodeState, i) => {
                newNodeState = getStateById(nodeState.id, action.payload.states);
                if (newNodeState) {
                    newState.states[i] = {...nodeState, ...newNodeState};
                }
            });
            return newState;
        }
        case SET_NODE_STATE: {
            const newState = {...state};
            newState.states.forEach((nodeState, i) => {
                if (nodeState.id === action.payload.id) {
                    newState.states[i] = {...nodeState, ...action.payload.nodeState};
               }
            });
            return newState;
        }
        default: {
            return state;
        }
    }
};