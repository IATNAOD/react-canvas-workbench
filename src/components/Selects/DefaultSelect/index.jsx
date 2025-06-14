import './style.sass';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import React from 'react';

export default ({
	label = '',
	options = [],
	error = false,
	selected = null,
	placeholder = '',
	onChange = () => {},
	wrapperWidth = '100%',
	background = '#e4d4f4',
}) => {
	const [IsOpen, SetIsOpen] = React.useState(false);
	const { t } = useTranslation();

	const handleSelect = (option) => {
		SetIsOpen(false);

		if (onChange) onChange(option);
	};

	return (
		<div
			style={{ width: wrapperWidth }}
			className={classNames({ 'default-select-wrapper': true, error })}
		>
			{label && <div className={classNames({ 'default-select-label': true })}>{label}</div>}{' '}
			<div
				onClick={() => SetIsOpen((prev) => !prev)}
				style={{ background, borderColor: background }}
				className={classNames({ 'default-select-value-wrapper': true, opened: IsOpen })}
			>
				<span className={classNames({ 'default-select-value': true })}>{selected ? selected.name : placeholder}</span>
				<span className={classNames({ 'default-select-value-arrow': true })} />
			</div>
			{IsOpen && (
				<div
					style={{ background }}
					className={classNames({ 'default-select-list-wrapper': true })}
				>
					<div className={classNames({ 'default-select-list': true })}>
						{options.length > 0 ? (
							options.map((option, index) => (
								<div
									key={index}
									onClick={() => handleSelect(option)}
									className={classNames({ 'default-select-list-item': true, picked: option.value == selected?.value })}
								>
									{option.name}
								</div>
							))
						) : (
							<div className={classNames({ 'default-select-list-items-not-found': true })}>
								{t('default-select.no-options-found')}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
