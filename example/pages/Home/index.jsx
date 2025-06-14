import './style.sass';

import { ElementsMenu, EditorCanvas, EditorControls, useElements } from '../../../src/index';
import React from 'react';

export default ({}) => {
	const { elements } = useElements();

	React.useEffect(() => {
		console.log({ elements });
	}, [elements]);

	return (
		<div className={'editor'}>
			<div className={'editor-elements'}>
				<ElementsMenu />
			</div>
			<div className={'editor-content'}>
				<EditorControls />
				<EditorCanvas background={'#ffffff'} />
			</div>
		</div>
	);
};
