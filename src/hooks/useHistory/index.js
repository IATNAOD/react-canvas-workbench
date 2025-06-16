import { useReduxDispatch, useReduxState } from '../useRedux';

import { undoHistory, redoHistory, resetHistory } from '../../store/actions/editor';

export default () => {
	const historyIndex = useReduxState((s) => s.editorManager.history.index);
	const canUndo = useReduxState((s) => s.editorManager.history.canUndo);
	const canRedo = useReduxState((s) => s.editorManager.history.canRedo);
	const history = useReduxState((s) => s.editorManager.history.list);
	const dispatch = useReduxDispatch();

	const undoWrapper = () => dispatch(undoHistory());

	const redoWrapper = () => dispatch(redoHistory());

	const resetWrapper = (...args) => dispatch(resetHistory(...args));

	return {
		canUndo,
		canRedo,
		list: history,
		index: historyIndex,
		current: history[historyIndex],
		undo: undoWrapper,
		redo: redoWrapper,
		reset: resetWrapper,
	};
};
