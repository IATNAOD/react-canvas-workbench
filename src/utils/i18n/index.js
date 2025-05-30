import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import { default_language } from '../../config';
import ru from './../../locales/ru.json';
import en from './../../locales/en.json';

i18n.use(initReactI18next).init({
	fallbackLng: default_language,
	interpolation: { escapeValue: false },
	resources: { ru: { translation: ru }, en: { translation: en } },
});
