import { useSyncExternalStore } from 'react';

import { store } from '../../store';

export const useReduxState = (selector) => useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const useReduxDispatch = () => store.dispatch;
