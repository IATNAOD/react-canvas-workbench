import { takeEvery } from 'redux-saga/effects';

import { bindAsyncActions } from '../../../utils/store/helpers';

import { changeEditorField, changeEditorFieldAsync } from '../../actions/editor';

function changeFieldWorker({ name, value }) {
	return { name, value };
}

export function* editorSaga() {
	yield takeEvery(changeEditorField, bindAsyncActions(changeEditorFieldAsync)(changeFieldWorker));
}
