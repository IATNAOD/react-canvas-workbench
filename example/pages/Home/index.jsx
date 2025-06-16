import './style.sass';

import { ElementsMenu, EditorCanvas, EditorControls, useElements, useHistory } from '../../../src/index';
import uuid4 from 'uuid4';
import React from 'react';

export default ({}) => {
	const { current, list, index, canUndo, canRedo, undo, redo, reset } = useHistory();
	const { elements, changeElements } = useElements();

	React.useEffect(() => {
		console.log({ elements });
	}, [elements]);

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
