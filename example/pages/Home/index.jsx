import './style.sass';

import { ElementsList } from '../../../src/index';
import React from 'react';

export default ({}) => {
	return (
		<div className={'editor'}>
			<div className={'editor-elements'}>
				<ElementsList />
			</div>
		</div>
	);
};
