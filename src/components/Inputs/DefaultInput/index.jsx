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
	labelColor = '#53504A',
	inputColor = '#53504a',
	inputBackground = '#e4d4f4',
}) => {
	return (
		<div
			style={{ width: wrapperWidth }}
			className={classNames({ 'default-input-wrapper': true, error })}
		>
			{label && (
				<span
					style={{ color: labelColor }}
					className={classNames({ 'input-label': true })}
				>
					{label}
				</span>
			)}
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
					color: inputColor,
					background: inputBackground,
					border: `1px solid ${inputBackground}`,
					width: `calc(${inputWidth} - 50px)`,
					height: `calc(${inputHeight}px - 2px)`,
				}}
			/>
		</div>
	);
};
