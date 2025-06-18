import { all, take } from 'redux-saga/effects';

import { customizationSaga } from './customization';
import { editorSaga } from './editor';

export default function* () {
	yield all([editorSaga(), customizationSaga()]);
}
