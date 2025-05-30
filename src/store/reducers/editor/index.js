import { handleActions } from 'redux-actions';

import { changeEditorFieldAsync } from '../../actions/editor';

const initialState = {
	elements: [],
};

export default handleActions(
	{
		[changeEditorFieldAsync.success]: (s, { payload: { name, value } } = {}) => ({ ...s, [name]: value }),
	},
	initialState
);
