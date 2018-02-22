import tree from './selector';
import {getNodeState} from './selector';
import {SHOW_CONTAINER_MENU} from 'services/action-types';

export const SET_NODES_STATE = 'SET_NODES_STATE';
export const SET_INIT_STATES = 'SET_INIT_STATES';
export const SET_NODE_EXPANDED = 'SET_NODE_EXPANDED';
export const SET_NODE_STATE = 'UPDATE_NODE_STATE';

export const initNodeStates = (mapId, nodes) =>{
    const defaultNodeState = {
        checked: false,
        expanded: false,
        hidden: false,
        disabled: false,
        selected: false,
        active: false,
    };

    return (dispatch, getState) => {

        const states = nodes.map(n => {
            return {
                ...defaultNodeState,
                id: n.id
            }
        });

        dispatch({
            type: SET_INIT_STATES,
            payload: {
                states: states,
                rootNodeId: mapId
            }
        })
    }
};

export const setNodesState = (nodes) => {
    const states = [];
    nodes.forEach(n => {
        states.push({
            id: n.id,
            checked: n.checked,
            expanded: n.expanded,
            hidden: n.hidden,
            disabled: n.disabled,
            selected: n.selected,
            active: n.active
        });
    });
    return (dispatch, getState) => {
        dispatch({
            type: SET_NODES_STATE,
            payload: {
                states: states,
            }
        })
    }
};

export const setNodeState = (id, nodeState) =>{
    return (dispatch, getState) => {
        dispatch({
            type: SET_NODE_STATE,
            payload: {
                nodeState: nodeState,
                id: id
            }
        })
    }
};


export const toggleExpanded = (id) => {
    return (dispatch, getState) => {
        let expanded = getNodeState(id).expanded;
        dispatch(setNodeState(id, {expanded: !expanded}))
    }
};
