import './style.sass';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import React from 'react';

export default ({
	label = '',
	options = [],
	selected = null,
	placeholder = '',
	onChange = () => {},
	labelColor = '#53504A',
	background = '#e4d4f4',
	valueColor = '#53504A',
	searchInputBorderColor = '#d9d9c5',
	pickedValueBackgroundColor = '#E05F38',
	searchInputBackgroundColor = '#f2eafa',
}) => {
	const [FilteredOptions, SetFilteredOptions] = React.useState(options);
	const [IsOpen, SetIsOpen] = React.useState(false);
	const [Search, SetSearch] = React.useState('');
	const { t } = useTranslation();

	const handleSelect = (option) => {
		SetIsOpen(false);

		SetSearch('');

		if (onChange) onChange(option);
	};

	React.useEffect(() => {
		SetFilteredOptions(options.filter((option) => option.name.toLowerCase().includes(Search.toLowerCase())));
	}, [Search]);

	return (
		<div className={classNames({ 'select-with-search-wrapper': true })}>
			{label && (
				<div
					style={{ color: labelColor }}
					className={classNames({ 'select-with-search-label': true })}
				>
					{label}
				</div>
			)}
			<div
				style={{ backgroundColor: background }}
				onClick={() => SetIsOpen((prev) => !prev)}
				className={classNames({ 'select-with-search-value-wrapper': true, opened: IsOpen })}
			>
				<span
					style={{ color: valueColor }}
					className={classNames({ 'select-with-search-value': true })}
				>
					{selected ? selected.name : placeholder}
				</span>
				<span className={classNames({ 'select-with-search-value-arrow': true })} />
			</div>
			{IsOpen && (
				<div
					style={{ backgroundColor: background }}
					className={classNames({ 'select-with-search-list-wrapper': true })}
				>
					<input
						type={'text'}
						value={Search}
						onChange={(e) => SetSearch(e.target.value)}
						placeholder={t('select-with-search.search')}
						className={classNames({ 'select-with-search-list-search-input': true })}
						style={{
							color: valueColor,
							borderColor: searchInputBorderColor,
							backgroundColor: searchInputBackgroundColor,
						}}
					/>
					<div className={classNames({ 'select-with-search-list': true })}>
						{FilteredOptions.length > 0 ? (
							FilteredOptions.map((option, index) => (
								<div
									key={index}
									onClick={() => handleSelect(option)}
									className={classNames({ 'select-with-search-list-item': true, picked: option.value == selected?.value })}
									style={{
										color: valueColor,
										...(option.value == selected?.value ? { backgroundColor: pickedValueBackgroundColor } : {}),
									}}
								>
									{option.name}
								</div>
							))
						) : (
							<div
								style={{ color: valueColor }}
								className={classNames({ 'select-with-search-list-items-not-found': true })}
							>
								{t('select-with-search.no-options-found')}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
