import app from 'index.js';
import reducer from './reducer';
import {setup} from './actions';

import EditDialog from './edit-dialog';

const initModule = (state, dispatch) => {
    dispatch(setup());
};

const modDefinition = {
    modFolder: 'containerEditor',
    name: 'containerEditor',
    module: {
        init: initModule,
        components: {
            EditDialog: EditDialog
        }
    },
    reducer: reducer
};


if (app && app.connectModule) {
    app.connectModule(modDefinition);
    app.loadModuleCss(modDefinition.modFolder).then(() => {
        // some actions after loading css
    });
}

