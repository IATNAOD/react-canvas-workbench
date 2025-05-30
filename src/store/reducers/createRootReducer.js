import { combineReducers } from 'redux';

import editorReducer from './editor';

export default () =>
	combineReducers({
		editorManager: editorReducer,
	});
