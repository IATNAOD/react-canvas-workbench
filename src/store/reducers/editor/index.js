import { handleActions } from 'redux-actions';

import {
	undoHistoryAsync,
	redoHistoryAsync,
	resetHistoryAsync,
	selectElementAsync,
	changeEditorFieldAsync,
	saveStateToHistoryAsync,
	changeEditorContentFieldAsync,
	changeEditorContentFieldsAsync,
	changeEditorSettingsFieldAsync,
} from '../../actions/editor';

const initialState = {
	content: {
		width: 3200,
		height: 1600,
		elements: [],
		selectedElement: null,
		selectedElementId: null,
	},
	history: {
		list: [],
		index: 0,
		canUndo: false,
		canRedo: false,
	},
	settings: {
		snap: 10,
		handleSize: 8,
		rotateHandleSize: 16,
		showMiddleLines: true,
		rotatehandleOffset: 30,
		positionChangeByArrows: {
			ArrowUp: { x: 0, y: -1 },
			ArrowRight: { x: 1, y: 0 },
			ArrowDown: { x: 0, y: 1 },
			ArrowLeft: { x: -1, y: 0 },
		},
	},
};

export default handleActions(
	{
		[changeEditorFieldAsync.success]: (s, { payload: { name, value } } = {}) => ({ ...s, [name]: value }),
		[changeEditorContentFieldAsync.success]: (s, { payload: { name, value } } = {}) => ({
			...s,
			content: { ...s.content, [name]: typeof value == 'function' ? value(s.content) : value },
		}),
		[changeEditorContentFieldsAsync.success]: (s, { payload: { updater } } = {}) => ({
			...s,
			content: { ...s.content, ...(typeof updater == 'function' ? updater(s.content) : updater) },
		}),
		[changeEditorSettingsFieldAsync.success]: (s, { payload: { name, value } } = {}) => ({
			...s,
			settings: { ...s.settings, [name]: typeof value == 'function' ? value(s.settings) : value },
		}),
		[selectElementAsync.success]: (s, { payload: { element } } = {}) => ({
			...s,
			content: {
				...s.content,
				selectedElement: s.content.selectedElementId == element.id ? null : element,
				selectedElementId: s.content.selectedElementId == element.id ? null : element.id,
				elements: s.content.elements.map((v) => (v.id == s.content.selectedElementId ? s.content.selectedElement : v)),
			},
		}),

		[saveStateToHistoryAsync.success]: (s, a) => ({
			...s,
			...(JSON.stringify(s.content.elements) != JSON.stringify(s.history.list[s.history.index])
				? {
						history: {
							...s.history,
							index: 0,
							canRedo: s.history.index > 0,
							canUndo: s.history.index < s.history.list.length,
							list: [s.content.elements, ...s.history.list.slice(s.history.index, s.history.list.length)],
						},
					}
				: {}),
		}),
		[resetHistoryAsync.success]: (s, { payload: { elements } }) => ({
			...s,
			history: {
				...s.history,
				index: 0,
				canUndo: false,
				canRedo: false,
				list: [elements],
			},
		}),
		[undoHistoryAsync.success]: (s, a) => ({
			...s,
			...(s.history.canUndo
				? {
						history: {
							...s.history,
							canRedo: s.history.index + 1 > 0,
							canUndo: s.history.index + 1 < s.history.list.length - 1,
							index: Math.min(s.history.index + 1, s.history.list.length - 1),
						},
						content: {
							...s.content,
							selectedElement: null,
							selectedElementId: null,
							elements: s.history.list[s.history.index + 1],
						},
					}
				: {}),
		}),
		[redoHistoryAsync.success]: (s, a) => ({
			...s,
			...(s.history.canRedo
				? {
						history: {
							...s.history,
							canRedo: s.history.index - 1 > 0,
							canUndo: s.history.index - 1 < s.history.list.length - 1,
							index: Math.min(s.history.index - 1, s.history.list.length - 1),
						},
						content: {
							...s.content,
							selectedElement: null,
							selectedElementId: null,
							elements: s.history.list[s.history.index - 1],
						},
					}
				: {}),
		}),
	},
	initialState
);
