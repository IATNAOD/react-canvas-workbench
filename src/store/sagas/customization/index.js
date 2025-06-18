import { takeEvery } from 'redux-saga/effects';

import { bindAsyncActions } from '../../../utils/store/helpers';

import {
	setCustomizationSettings,
	setCustomizationSettingsAsync,
	changeCustomizationSettings,
	changeCustomizationSettingsAsync,
	resetCustomizationSettings,
	resetCustomizationSettingsAsync,
} from '../../actions/customization';

function setCustomizationSettingsWorker({ component, updater }) {
	return { component, updater };
}

function changeCustomizationSettingsWorker({ component, updater }) {
	return { component, updater };
}

function resetCustomizationSettingsWorker({ component }) {
	return { component };
}

export function* customizationSaga() {
	yield takeEvery(setCustomizationSettings, bindAsyncActions(setCustomizationSettingsAsync)(setCustomizationSettingsWorker));
	yield takeEvery(
		changeCustomizationSettings,
		bindAsyncActions(changeCustomizationSettingsAsync)(changeCustomizationSettingsWorker)
	);
	yield takeEvery(
		resetCustomizationSettings,
		bindAsyncActions(resetCustomizationSettingsAsync)(resetCustomizationSettingsWorker)
	);
}
