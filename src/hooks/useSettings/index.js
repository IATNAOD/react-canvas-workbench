import { useReduxDispatch, useReduxState } from '../useRedux';

import { changeEditorSettingsFields } from '../../store/actions/editor';

export default () => {
	const settings = useReduxState((s) => s.editorManager.settings);
	const dispatch = useReduxDispatch();

	const changeSettings = (updater) => dispatch(changeEditorSettingsFields({ updater }));

	const resetSettings = () =>
		dispatch(
			changeEditorSettingsFields({
				updater: {
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
			})
		);

	return {
		settings,
		resetSettings,
		changeSettings,
	};
};
