import { all, take } from 'redux-saga/effects';

import { editorSaga } from './editor';

export default function* () {
	yield all([editorSaga()]);
}
