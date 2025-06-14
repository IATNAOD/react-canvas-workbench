import './style.sass';

import classNames from 'classnames';
import React from 'react';

import { useReduxDispatch, useReduxState } from '../../hooks/useRedux';

import { redoHistory, undoHistory } from '../../store/actions/editor';
import UndoIcon from '../Icons/UndoIcon';
import RedoIcon from '../Icons/RedoIcon';

export default ({}) => {
	const canUndo = useReduxState((s) => s.editorManager.history.canUndo);
	const canRedo = useReduxState((s) => s.editorManager.history.canRedo);
	const dispatch = useReduxDispatch();

	return (
		<div className={classNames({ 'editor-controls': true })}>
			<div className={classNames({ 'editor-controls-history': true })}>
				<div
					onClick={() => (canUndo ? dispatch(undoHistory()) : null)}
					className={classNames({ 'editor-controls-history-button': true, disabled: !canUndo })}
				>
					<UndoIcon fill={canUndo ? '#7828c8' : '#71717A'} />
				</div>
				<div
					onClick={() => (canRedo ? dispatch(redoHistory()) : null)}
					className={classNames({ 'editor-controls-history-button': true, disabled: !canRedo })}
				>
					<RedoIcon fill={canRedo ? '#7828c8' : '#71717A'} />
				</div>
			</div>
		</div>
	);
};
