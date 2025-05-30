import { createActionFactory } from '../../../utils/store/helpers';

const factory = createActionFactory('EDITOR');

export const changeEditorField = factory.create('CHANGE_EDITOR_FIELD');
export const changeEditorFieldAsync = factory.createAsync('CHANGE_EDITOR_FIELD_ASYNC');
