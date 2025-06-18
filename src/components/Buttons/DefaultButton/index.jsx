import './style.sass';

import classNames from 'classnames';
import React from 'react';

export default ({
	flex = 0,
	text = '',
	height = 54,
	fontSize = 0,
	gap = '20px',
	error = false,
	fontColor = '',
	width = '100%',
	leftIcon = null,
	type = 'primary',
	disabled = false,
	rightIcon = null,
	borderColor = '',
	pickedColor = '',
	onClick = () => {},
	textPaddingLeft = 0,
	textPaddingRight = 0,
	background = '#7828C8',
	pickedBorderColor = '',
}) => {
	return (
		<div
			onClick={() => (disabled ? null : onClick())}
			style={{
				backgroundColor: background,
				...(gap ? { gap } : {}),
				...(flex ? { flex } : { minWidth: `calc(${width} - 24px)` }),
				maxHeight: `calc(${height}px - 20px - ${type.includes('transparent') ? 4 : 0}px)`,
				minHeight: `calc(${height}px - 20px - ${type.includes('transparent') ? 4 : 0}px)`,
				...(type.includes('picked') && pickedColor ? { backgroundColor: pickedColor } : {}),
				...(type.includes('picked') && pickedBorderColor
					? { borderColor: pickedBorderColor }
					: borderColor
						? { borderColor }
						: {}),
			}}
			className={classNames({
				error,
				disabled,
				'default-button': true,
				info: type.includes('info'),
				secondary: type.includes('secondary'),
				transparent: type.includes('transparent'),
			})}
		>
			{leftIcon && <div className={classNames({ 'icon-wrapper': true })}>{leftIcon}</div>}
			<span
				className={classNames({ text: true })}
				style={{
					paddingLeft: textPaddingLeft,
					paddingRight: textPaddingRight,
					...(fontSize ? { fontSize } : {}),
					...(fontColor ? { color: fontColor } : {}),
				}}
			>
				{text}
			</span>
			{rightIcon && <div className={classNames({ 'icon-wrapper': true })}>{rightIcon}</div>}
		</div>
	);
};
