import { createActionFactory } from '../../../utils/store/helpers';

const factory = createActionFactory('EDITOR');

export const changeEditorContentField = factory.create('CHANGE_EDITOR_CONTENT_FIELD');
export const changeEditorContentFieldAsync = factory.createAsync('CHANGE_EDITOR_CONTENT_FIELD_ASYNC');

export const changeEditorContentFields = factory.create('CHANGE_EDITOR_CONTENT_FIELDS');
export const changeEditorContentFieldsAsync = factory.createAsync('CHANGE_EDITOR_CONTENT_FIELDS_ASYNC');

export const changeEditorSettingsFields = factory.create('CHANGE_EDITOR_SETTINGS_FIELDS');
export const changeEditorSettingsFieldsAsync = factory.createAsync('CHANGE_EDITOR_SETTINGS_FIELDS_ASYNC');

export const selectElement = factory.create('SELECT_ELEMENT');
export const selectElementAsync = factory.createAsync('SELECT_ELEMENT_ASYNC');

export const saveStateToHistory = factory.create('SAVE_STATE_TO_HISTORY');
export const saveStateToHistoryAsync = factory.createAsync('SAVE_STATE_TO_HISTORY_ASYNC');

export const resetHistory = factory.create('RESET_HISTORY');
export const resetHistoryAsync = factory.createAsync('RESET_HISTORY_ASYNC');

export const undoHistory = factory.create('UNDO_HISTORY');
export const undoHistoryAsync = factory.createAsync('UNDO_HISTORY_ASYNC');

export const redoHistory = factory.create('REDO_HISTORY');
export const redoHistoryAsync = factory.createAsync('REDO_HISTORY_ASYNC');
