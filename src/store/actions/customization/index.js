import { createActionFactory } from '../../../utils/store/helpers';

const factory = createActionFactory('CUSTOMIZATION');

export const setCustomizationSettings = factory.create('SET_CUSTOMIZATION_SETTINGS');
export const setCustomizationSettingsAsync = factory.createAsync('SET_CUSTOMIZATION_SETTINGS_ASYNC');

export const changeCustomizationSettings = factory.create('CHANGE_CUSTOMIZATION_SETTINGS');
export const changeCustomizationSettingsAsync = factory.createAsync('CHANGE_CUSTOMIZATION_SETTINGS_ASYNC');

export const resetCustomizationSettings = factory.create('RESET_CUSTOMIZATION_SETTINGS');
export const resetCustomizationSettingsAsync = factory.createAsync('RESET_CUSTOMIZATION_SETTINGS_ASYNC');
