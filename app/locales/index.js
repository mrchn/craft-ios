// @/app/locales
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import ru from './ru.json';
import en from './en.json';

const LANGUAGE_KEY = 'user-language';

const languageDetector = {
	type: 'languageDetector', async: true,
	init: () => {}, detect: (callback) => {
		AsyncStorage.getItem(LANGUAGE_KEY).then((savedLanguage) => {
			if (savedLanguage) { return callback(savedLanguage) }
			const systemLanguage = Localization.getLocales()[0]?.languageCode || 'en';
			callback(systemLanguage);
		}).catch(() => {callback('en')})
	}, cacheUserLanguage: (language) => {
		AsyncStorage.setItem(LANGUAGE_KEY, language).catch(() => {})
	},
};

i18n.use(languageDetector).use(initReactI18next).init({
	resources: {
		ru: { translation: ru },
		en: { translation: en }
	},
	fallbackLng: 'en', compatibilityJSON: 'v4',
	interpolation: { escapeValue: false }
});

export default i18n;