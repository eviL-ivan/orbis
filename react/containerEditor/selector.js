import getStore from 'store';

export default (selector) => {
    return getStore().getState().containerEditor;
}