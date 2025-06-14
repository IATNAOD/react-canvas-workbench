import '../../utils/i18n';

import { useTranslation } from 'react-i18next';

export default () => {
	const { t, i18n } = useTranslation('translation');

	const changeLanguage = (language) => {
		i18n.changeLanguage(language);
	};

	const addResources = (language, resources) => {
		i18n.addResources(language, 'translation', resources);
	};

	return { t, changeLanguage, addResources };
};
