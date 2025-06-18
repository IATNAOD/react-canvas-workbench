import { useReduxDispatch, useReduxState } from '../useRedux';

import { changeEditorContentField, selectElement } from '../../store/actions/editor';

export default () => {
	const selectedElementId = useReduxState((s) => s.editorManager.content.selectedElementId);
	const selectedElement = useReduxState((s) => s.editorManager.content.selectedElement);
	const elements = useReduxState((s) => s.editorManager.content.elements);
	const height = useReduxState((s) => s.editorManager.content.height);
	const width = useReduxState((s) => s.editorManager.content.width);
	const dispatch = useReduxDispatch();

	const changeWidth = (width) => {
		dispatch(changeEditorContentField({ name: 'width', value: width }));
	};

	const changeHeight = (height) => {
		dispatch(changeEditorContentField({ name: 'height', value: height }));
	};

	const changeElements = (updater) => {
		dispatch(
			changeEditorContentField({
				name: 'elements',
				value:
					typeof updater == 'function'
						? ({ elements, selectedElement, selectedElementId }) => updater({ elements, selectedElement, selectedElementId })
						: [...updater],
			})
		);
	};

	const selectElementById = (elementId) => {
		const element = elements.find((e) => e.id == elementId);

		dispatch(selectElement({ element }));
	};

	const deselectElement = () => {
		dispatch(selectElement({ element: null }));
	};

	const changeSelectedElement = (updater) => {
		dispatch(
			changeEditorContentField({
				name: 'selectedElement',
				value:
					typeof updater == 'function'
						? ({ elements, selectedElement, selectedElementId }) => updater({ elements, selectedElement, selectedElementId })
						: { ...updater },
			})
		);
	};

	return {
		width,
		height,
		elements,
		selectedElement,
		selectedElementId,
		changeWidth,
		changeHeight,
		changeElements,
		deselectElement,
		selectElementById,
		changeSelectedElement,
	};
};
