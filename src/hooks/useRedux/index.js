import { useSyncExternalStore } from 'react';

import { store } from '../../store';

export const useReduxState = (selector) => {
	const getSnapshot = () => selector(store.getState());

	return useSyncExternalStore(store.subscribe, getSnapshot);
};

export const useReduxDispatch = () => store.dispatch;
