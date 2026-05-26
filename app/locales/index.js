// @/app/locales
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import ru from './ru.json';
import en from './en.json';

const LANGUAGE_KEY = 'user-language';

const initI18n = async () => {
	let lng = 'en';
	try {
		const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
		lng = saved ?? Localization.getLocales()[0]?.languageCode ?? 'en'
	} catch {}

	// eslint-disable-next-line import/no-named-as-default-member
	await i18n.use(initReactI18next).init({
		lng, resources: {
			ru: { translation: ru },
			en: { translation: en }
		},
		fallbackLng: 'en',
		interpolation: { escapeValue: false }
	});
};

initI18n();
export default i18n;