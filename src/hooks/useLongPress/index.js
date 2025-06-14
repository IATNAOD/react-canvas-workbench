import React from 'react';

export default (onLongPress, onStart, onClick, { delay = 1000 } = {}) => {
	const [LongPressTriggered, SetLongPressTriggered] = React.useState(false);
	const [LongPressDuration, SetLongPressDuration] = React.useState(0);
	const [LongPressProgress, SetLongPressProgress] = React.useState(0);
	const interval = React.useRef();
	const timeout = React.useRef();

	const start = React.useCallback(
		(event) => {
			event.preventDefault();
			event.stopPropagation();

			onStart();

			interval.current = setInterval(() => {
				SetLongPressDuration((prev) => Math.min(prev + 100, delay));
			}, 100);

			timeout.current = setTimeout(() => {
				onLongPress(event);
				SetLongPressTriggered(true);
			}, delay);
		},
		[onLongPress, delay]
	);

	const clear = React.useCallback(() => {
		interval.current && clearInterval(interval.current);
		timeout.current && clearTimeout(timeout.current);

		if (!LongPressTriggered) onClick();

		SetLongPressTriggered(false);
		SetLongPressDuration(0);
		SetLongPressProgress(0);
	}, [onClick, LongPressTriggered]);

	React.useEffect(() => {
		SetLongPressProgress(LongPressDuration / (delay / 100) / 100);
	}, [LongPressDuration]);

	return {
		duration: LongPressDuration,
		progress: LongPressProgress,
		handlers: {
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
			},
			onMouseDown: (e) => start(e),
			onTouchStart: (e) => start(e),
			onMouseUp: () => clear(),
			onTouchEnd: () => clear(),
		},
	};
};
