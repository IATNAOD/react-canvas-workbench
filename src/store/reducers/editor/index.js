import { handleActions } from 'redux-actions';

import {
	undoHistoryAsync,
	redoHistoryAsync,
	resetHistoryAsync,
	selectElementAsync,
	saveStateToHistoryAsync,
	changeEditorContentFieldAsync,
	changeEditorContentFieldsAsync,
	changeEditorSettingsFieldsAsync,
} from '../../actions/editor';

const initialState = {
	content: {
		fonts: [],
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
		snap: 30,
		handleSize: 8,
		rotateHandleSize: 16,
		showMiddleLines: true,
		rotatehandleOffset: 30,
		positionChangeByArrowsShiftMultiplier: 10,
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
		[changeEditorContentFieldAsync.success]: (s, { payload: { name, updater } } = {}) => ({
			...s,
			content: { ...s.content, [name]: typeof updater == 'function' ? updater(s.content) : updater },
		}),
		[changeEditorContentFieldsAsync.success]: (s, { payload: { updater } } = {}) => ({
			...s,
			content: { ...s.content, ...(typeof updater == 'function' ? updater(s.content) : updater) },
		}),
		[changeEditorSettingsFieldsAsync.success]: (s, { payload: { updater } } = {}) => ({
			...s,
			settings: { ...s.settings, ...(typeof updater == 'function' ? updater(s.settings) : updater) },
		}),
		[selectElementAsync.success]: (s, { payload: { element } } = {}) => ({
			...s,
			content: {
				...s.content,
				selectedElement: !element || (element && s.content.selectedElementId == element.id) ? null : element,
				selectedElementId: !element || (element && s.content.selectedElementId == element.id) ? null : element.id,
				elements: s.content.elements.map((v) => (v.id == s.content.selectedElementId ? s.content.selectedElement : v)),
			},
		}),

		[saveStateToHistoryAsync.success]: (s, a) => ({
			...s,
			...(JSON.stringify(s.content.elements.map((v) => ({ ...v, image: v.image?.currentSrc }))) !=
			JSON.stringify((s.history.list[s.history.index] || []).map((v) => ({ ...v, image: v.image?.currentSrc })))
				? {
						history: {
							...s.history,
							index: 0,
							canRedo: false,
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
