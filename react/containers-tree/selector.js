import getStore from 'store';

export default () => {
    return getStore().getState().designer.containersTree;
}

export const getNodeState = (id) => {
    const states = getStore().getState().designer.containersTree.states;
    return states.filter(s => {
        return s.id === id;
    })[0];
};