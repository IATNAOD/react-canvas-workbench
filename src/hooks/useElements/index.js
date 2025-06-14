import { useReduxDispatch, useReduxState } from '../../hooks/useRedux';

import { changeEditorContentField } from '../../store/actions/editor';

export default () => {
	const elements = useReduxState((s) => s.editorManager.content.elements);
	const dispatch = useReduxDispatch();

	const changeElements = (updater) => {
		dispatch(
			changeEditorContentField({
				name: 'elements',
				value: typeof updater == 'function' ? ({ elements }) => updater(elements) : updater,
			})
		);
	};

	return { elements, changeElements };
};
