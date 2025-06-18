import { combineReducers } from 'redux';

import customizationReducer from './customization';
import editorReducer from './editor';

export default () =>
	combineReducers({
		editorManager: editorReducer,
		customizationManager: customizationReducer,
	});
