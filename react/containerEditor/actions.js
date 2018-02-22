import {CONTAINER_MENU_APPLY} from 'services/action-types';
import {CLOSE_EDIT_DIALOG} from 'services/action-types';

export const setup = () => {
    return (dispatch, getState) => {
        dispatch({
            type: CONTAINER_MENU_APPLY,
            payload: {
                map: [
                    {
                        label: 'Изменить свойства',
                        action: 'editProps'
                    },
                    {
                        action: 'divider'
                    },
                    {
                        label: 'Удалить карту',
                        action: 'remove'
                    }
                ],
                folder: [
                    {
                        label: 'Создать карту',
                        action: 'createMap'
                    },
                    {
                        label: 'Создать папку',
                        action: 'createFolder'
                    },
                    {
                        label: 'Изменить свойства',
                        action: 'editProps'
                    },
                    {
                        action: 'divider'
                    },
                    {
                        label: 'Удалить папку',
                        action: 'remove'
                    }
                ],
                layer: [
                    {
                        label: 'Изменить свойства',
                        action: 'editProps'
                    },
                    {
                        action: 'divider'
                    },
                    {
                        label: 'Удалить слой',
                        action: 'remove'
                    }
                ]
            }
        })
    }
};

export const closeEditDialog = () => {
    return (dispatch, getState) => {
        dispatch({
            type: CLOSE_EDIT_DIALOG,
            payload: {}
        })
    }
};