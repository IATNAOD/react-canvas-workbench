import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import createRootReducer from './reducers/createRootReducer';
import sagas from './sagas';

const loggerActionColors = { success: 'green', failed: 'red', started: 'blue' };

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
	reducer: createRootReducer(),
	preloadedState: {},
	middleware: () => [
		sagaMiddleware,
		createLogger({
			collapsed: true,
			duration: true,
			colors: {
				title: (action) => loggerActionColors[action.type.split('.')[1]],
			},
		}),
	],
	devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(sagas);
