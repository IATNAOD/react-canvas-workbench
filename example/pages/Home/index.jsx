import './style.sass';

import uuid4 from 'uuid4';
import React from 'react';

import {
	useContent,
	useHistory,
	useSettings,
	ElementsMenu,
	EditorCanvas,
	EditorControls,
	useCustomization,
} from '../../../src/index';

export default ({}) => {
	const { customization, setCustomizationSettings, changeCustomizationSettings, resetCustomizationSettings } = useCustomization();
	const { current, list, index, canUndo, canRedo, undo, redo, reset } = useHistory();
	const { elements, selectedElementId, changeElements } = useContent();
	const { settings, changeSettings, resetSettings } = useSettings();

	React.useEffect(() => {
		console.log({ customization });
	}, [customization]);

	React.useEffect(() => {
		console.log({ settings });
	}, [settings]);

	React.useEffect(() => {
		console.log({ elements });
	}, [elements]);

	React.useEffect(() => {
		console.log({ selectedElementId });
	}, [selectedElementId]);

	React.useEffect(() => {
		console.log({ current, list, index, canUndo, canRedo });
	}, [current, list, index, canUndo, canRedo]);

	React.useEffect(() => {
		const initialElements = [
			{
				x: 0,
				y: 0,
				rotate: 0,
				paths: [],
				id: uuid4(),
				width: 3200,
				height: 1600,
				locked: false,
				visible: true,
				brushWidth: 20,
				type: 'canvas',
				color: '#000000',
			},
		];

		changeElements(initialElements);

		reset({ elements: initialElements });

		changeCustomizationSettings({
			component: 'elementsMenu',
			updater: (state) => ({ ...state, openTypesButtonBackgroundColor: 'wheat' }),
		});

		setTimeout(() => {
			changeSettings({ handleSize: 16 });
		}, 1000);

		setTimeout(() => {
			resetSettings();

			resetCustomizationSettings();
		}, 3000);
	}, []);

	return (
		<div className={'editor'}>
			<div className={'editor-elements'}>
				<ElementsMenu />
			</div>
			<div className={'editor-content'}>
				<div className={'external-controls'}>
					<div
						onClick={undo}
						className={'external-controls-button'}
					>
						undo
					</div>
					<div
						onClick={redo}
						className={'external-controls-button'}
					>
						redo
					</div>
				</div>
				<EditorControls />
				<EditorCanvas background={'#ffffff'} />
			</div>
		</div>
	);
};
