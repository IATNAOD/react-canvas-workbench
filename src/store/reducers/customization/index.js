import { handleActions } from 'redux-actions';

import {
	setCustomizationSettingsAsync,
	resetCustomizationSettingsAsync,
	changeCustomizationSettingsAsync,
} from '../../actions/customization';

const initialState = {
	editorControls: {
		undoActiveColor: '#7828c8',
		redoActiveColor: '#7828c8',
		undoInactiveColor: '#71717A',
		redoInactiveColor: '#71717A',
	},
	elementsMenu: {
		backgroundColor: '#E4D4F4',
		selectLabelColor: '#53504A',
		selectValueColor: '#53504A',
		listItemNameColor: '#53504A',
		settingsLabelColor: '#53504a',
		settingsInputColor: '#53504a',
		imageUploadIconColor: '#7828c8',
		typesBackgroundColor: '#e4d4f4',
		selectBackgroundColor: '#e4d4f4',
		imageUploadBorderColor: '#7828c8',
		listItemBackgroundColor: '#F2EAFA',
		listItemDeleteAlertColor: '#F31260',
		typeButtonBackgroundColor: '#006FEE',
		listItemControlsIconColor: '#27272A',
		selectWithSearchBackground: '#e4d4f4',
		selectWithSearchValueColor: '#53504A',
		selectWithSearchLabelColor: '#53504A',
		imageUploadBackgroundColor: '#e4d4f4',
		listItemSelectedBorderColor: '#7828C8',
		settingsInputBackgroundColor: '#e4d4f4',
		openTypesButtonBackgroundColor: '#7828c8',
		closeTypesButtonBackgroundColor: '#7828c8',
		selectPickedValueBackgroundColor: '#E05F38',
		listItemDeleteButtonBackgroundColor: '#F31260',
		selectWithSearchSearchInputBorderColor: '#d9d9c5',
		selectWithSearchPickedValueBackgroundColor: '#E05F38',
		selectWithSearchSearchInputBackgroundColor: '#f2eafa',
		colorPicker: { rgbaTextColor: '', inputTextColor: '', backgroundColor: '', inputBackgroundColor: '' },
	},
	editorCanvas: {
		snapLineWidth: 2,
		brushBorderWidth: 2,
		middleLinesColor: 2,
		snapLineColor: '#3c5eec',
		resizeHandleBorderWidth: 1,
		rotateHandleBorderWidth: 1,
		backgroundColor: '#ffffff',
		brushBorderColor: '#7828c8',
		middleLinesWidth: '#3c5eec',
		hoveredElementBorderWidth: 3,
		selectedElementBorderWidth: 3,
		resizeHandleBorderColor: '#000000',
		rotateHandleBorderColor: '#000000',
		emptyImageBackgroundColor: '#3c5eec',
		hoveredElementBorderColor: '#7828c8',
		selectedElementBorderColor: '#7828c8',
		rotateHandleBackgroundColor: '#F5A524',
		resizeHandleBackgroundColor: '#17C964',
	},
	colorPicker: {
		rgbaTextColor: '#8e8e83',
		inputTextColor: '#53504a',
		backgroundColor: '#e4d4f4',
		inputBackgroundColor: '#f2eafa',
	},
};

export default handleActions(
	{
		[setCustomizationSettingsAsync.success]: (s, { payload: { updater } } = {}) => ({
			...s,
			...(typeof updater == 'function' ? updater(s) : updater),
		}),
		[changeCustomizationSettingsAsync.success]: (s, { payload: { component, updater } } = {}) => ({
			...s,
			[component]: typeof updater == 'function' ? updater(s[component]) : updater,
		}),
		[resetCustomizationSettingsAsync.success]: (s, { payload: { component } }) => ({
			...s,
			...(['', 'all', 'editorControls'].includes(component) ? { editorControls: initialState.editorControls } : {}),
			...(['', 'all', 'elementsMenu'].includes(component) ? { elementsMenu: initialState.elementsMenu } : {}),
			...(['', 'all', 'editorCanvas'].includes(component) ? { editorCanvas: initialState.editorCanvas } : {}),
			...(['', 'all', 'colorPicker'].includes(component) ? { colorPicker: initialState.colorPicker } : {}),
		}),
	},
	initialState
);
