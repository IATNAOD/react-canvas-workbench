import './style.sass';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import React from 'react';

export default ({ label = '', placeholder = '', selected = null, onChange = () => {}, options = [] }) => {
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
			{label && <div className={classNames({ 'select-with-search-label': true })}>{label}</div>}{' '}
			<div
				className={classNames({ 'select-with-search-value-wrapper': true, opened: IsOpen })}
				onClick={() => SetIsOpen((prev) => !prev)}
			>
				<span className={classNames({ 'select-with-search-value': true })}>{selected ? selected.name : placeholder}</span>
				<span className={classNames({ 'select-with-search-value-arrow': true })} />
			</div>
			{IsOpen && (
				<div className={classNames({ 'select-with-search-list-wrapper': true })}>
					<input
						type={'text'}
						value={Search}
						onChange={(e) => SetSearch(e.target.value)}
						placeholder={t('select-with-search.search')}
						className={classNames({ 'select-with-search-list-search-input': true })}
					/>
					<div className={classNames({ 'select-with-search-list': true })}>
						{FilteredOptions.length > 0 ? (
							FilteredOptions.map((option, index) => (
								<div
									key={index}
									onClick={() => handleSelect(option)}
									className={classNames({ 'select-with-search-list-item': true, picked: option.value == selected?.value })}
								>
									{option.name}
								</div>
							))
						) : (
							<div className={classNames({ 'select-with-search-list-items-not-found': true })}>
								{t('select-with-search.no-options-found')}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
