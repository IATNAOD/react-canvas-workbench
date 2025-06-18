import { useReduxDispatch, useReduxState } from '../useRedux';

import {
	setCustomizationSettings,
	resetCustomizationSettings,
	changeCustomizationSettings,
} from '../../store/actions/customization';

export default () => {
	const customization = useReduxState((s) => s.customizationManager);
	const dispatch = useReduxDispatch();

	const setCustomizationSettingsWrapper = ({ component, updater } = {}) =>
		dispatch(setCustomizationSettings({ component, updater }));

	const resetCustomizationSettingsWrapper = ({ component } = { component: 'all' }) =>
		dispatch(resetCustomizationSettings({ component }));

	const changeCustomizationSettingsWrapper = ({ component, updater } = {}) =>
		dispatch(changeCustomizationSettings({ component, updater }));

	return {
		customization,
		setCustomizationSettings: setCustomizationSettingsWrapper,
		resetCustomizationSettings: resetCustomizationSettingsWrapper,
		changeCustomizationSettings: changeCustomizationSettingsWrapper,
	};
};
