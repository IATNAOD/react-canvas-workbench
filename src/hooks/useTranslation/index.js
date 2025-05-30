import '../../utils/i18n';

import { useTranslation } from 'react-i18next';
import React from 'react';

export default ({ defaultLanguage = 'en', defaultResources = null } = {}) => {
	const { t, i18n } = useTranslation('translation');

	const changeLanguage = (language) => {
		i18n.changeLanguage(language);
	};

	const addResources = (language, resources) => {
		i18n.addResources(language, 'translation', resources);
	};

	React.useEffect(() => {
		i18n.changeLanguage(defaultLanguage);
	}, [defaultLanguage]);

	React.useEffect(() => {
		if (defaultResources) {
			i18n.addResources(defaultLanguage, 'translation', defaultResources);

			i18n.changeLanguage(defaultLanguage);
		}
	}, [defaultResources]);

	return { t, changeLanguage, addResources };
};
