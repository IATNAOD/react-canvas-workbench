import { takeEvery } from 'redux-saga/effects';

import { bindAsyncActions } from '../../../utils/store/helpers';

import {
	undoHistory,
	undoHistoryAsync,
	redoHistory,
	redoHistoryAsync,
	resetHistory,
	resetHistoryAsync,
	selectElement,
	selectElementAsync,
	changeEditorField,
	saveStateToHistory,
	saveStateToHistoryAsync,
	changeEditorFieldAsync,
	changeEditorContentField,
	changeEditorContentFieldAsync,
	changeEditorContentFields,
	changeEditorContentFieldsAsync,
	changeEditorSettingsField,
	changeEditorSettingsFieldAsync,
} from '../../actions/editor';

function changeFieldWorker({ name, value }) {
	return { name, value };
}

function changeEditorContentFieldWorker({ name, value }) {
	return { name, value };
}

function changeEditorContentFieldsWorker({ updater }) {
	return { updater };
}

function changeEditorSettingsFieldWorker({ name, value }) {
	return { name, value };
}

function selectElementWorker({ element }) {
	return { element };
}

function saveStateToHistoryWorker() {
	return {};
}

function resetHistoryWorker({ elements }) {
	return { elements };
}

function undoHistoryWorker() {
	return {};
}

function redoHistoryWorker() {
	return {};
}

export function* editorSaga() {
	yield takeEvery(changeEditorField, bindAsyncActions(changeEditorFieldAsync)(changeFieldWorker));
	yield takeEvery(changeEditorContentField, bindAsyncActions(changeEditorContentFieldAsync)(changeEditorContentFieldWorker));
	yield takeEvery(changeEditorContentFields, bindAsyncActions(changeEditorContentFieldsAsync)(changeEditorContentFieldsWorker));
	yield takeEvery(changeEditorSettingsField, bindAsyncActions(changeEditorSettingsFieldAsync)(changeEditorSettingsFieldWorker));
	yield takeEvery(selectElement, bindAsyncActions(selectElementAsync)(selectElementWorker));
	yield takeEvery(saveStateToHistory, bindAsyncActions(saveStateToHistoryAsync)(saveStateToHistoryWorker));
	yield takeEvery(resetHistory, bindAsyncActions(resetHistoryAsync)(resetHistoryWorker));
	yield takeEvery(undoHistory, bindAsyncActions(undoHistoryAsync)(undoHistoryWorker));
	yield takeEvery(redoHistory, bindAsyncActions(redoHistoryAsync)(redoHistoryWorker));
}
