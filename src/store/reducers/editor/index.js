import { handleActions } from 'redux-actions';

import { changeEditorFieldAsync } from '../../actions/editor';

const initialState = {
	width: 3200,
	height: 1600,
	elements: [],
	selectedElement: null,
};

export default handleActions(
	{
		[changeEditorFieldAsync.success]: (s, { payload: { name, value } } = {}) => ({ ...s, [name]: value }),
	},
	initialState
);
