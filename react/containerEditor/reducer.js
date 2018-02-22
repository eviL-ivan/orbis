import {CONTAINER_MENU_APPLY, SHOW_EDIT_DIALOG, CLOSE_EDIT_DIALOG} from 'services/action-types';

export const initialState = {
    editDialog: {
        isOpen: false,
        containerId: null,
        values: {},
        initValues: {}
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SHOW_EDIT_DIALOG: {
            return {...state, ...action.payload};
        }
        case CLOSE_EDIT_DIALOG: {
            return {...state, editDialog: {...initialState.editDialog}};
        }
        default: {
            return state;
        }
    }
};