import { store } from '../../store';
import { useSyncExternalStore } from 'react';

export const useReduxState = (selector) => useSyncExternalStore(store.subscribe, () => selector(store.getState()));

export const useReduxDispatch = () => store.dispatch;
