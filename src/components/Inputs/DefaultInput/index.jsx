import './style.sass';

import classNames from 'classnames';
import React from 'react';

export default ({
	name = '',
	value = '',
	label = '',
	error = false,
	disabled = false,
	inputHeight = 21,
	type = 'default',
	placeholder = '',
	onBlur = () => {},
	onEnter = () => {},
	inpytType = 'text',
	onChange = () => {},
	inputWidth = '100%',
	wrapperWidth = '100%',
	background = '#e4d4f4',
}) => {
	return (
		<div
			style={{ width: wrapperWidth }}
			className={classNames({ 'default-input-wrapper': true, error })}
		>
			{label && <span className={classNames({ 'input-label': true })}>{label}</span>}
			<input
				name={name}
				value={value}
				onBlur={onBlur}
				type={inpytType}
				onChange={onChange}
				disabled={disabled}
				placeholder={placeholder}
				onKeyDown={(e) => e.stopPropagation()}
				className={classNames({ input: true })}
				onKeyUp={(e) => (e.key === 'Enter' ? onEnter() : null)}
				style={{
					background: background,
					border: `1px solid ${background}`,
					width: `calc(${inputWidth} - 50px)`,
					height: `calc(${inputHeight}px - 2px)`,
				}}
			/>
		</div>
	);
};
