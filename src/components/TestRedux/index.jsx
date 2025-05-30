import { useReduxState, useReduxDispatch } from '../../hooks/useRedux';
import { changeEditorField } from '../../store/actions/editor';
import React from 'react';

export default () => {
	const elements = useReduxState((s) => s.editorManager.elements);
	const dispatch = useReduxDispatch();

	return (
		<div>
			<p>elements: {JSON.stringify(elements)}</p>
			<button onClick={() => dispatch(changeEditorField({ name: 'elements', value: [] }))}>–</button>
			<button onClick={() => dispatch(changeEditorField({ name: 'elements', value: [{ count: 1 }] }))}>+</button>
		</div>
	);
};
