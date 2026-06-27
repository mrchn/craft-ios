// @/services/create (pdfcraft-mobile)

import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { DOCX_MIME } from '@/components';
import { Parse, Generate } from './server';
import { localConvert } from '@/modules/ios-native-convert';

type Params = {
	doc: { uri: string; title: string; };
	data: Record<string, string>;
	url: string; t: (key: string) => string
};

export async function Create ({ doc, data, url, t }: Params) {

	const uri = await Generate(doc.uri, doc.title, data);

	if (uri) {
		const docx_title = uri.split('/').pop()
			|| `crafted_${doc.title}`;
		const pdf_title = docx_title.replace('.docx', '.pdf');
		const pdf_uri = `${FileSystem.documentDirectory}${pdf_title}`;

		const isConvertedLocally = await localConvert(uri, pdf_uri);

		if (!isConvertedLocally) {
			const formData = new FormData();
			formData.append('file', {
				uri: uri, name: docx_title, type: DOCX_MIME
			} as any);

			const res = await fetch(`${url}/convert`, {
				method: 'POST', body: formData,
				headers: { 'Accept': 'application/pdf' }
			});
			const contentType = res.headers.get('content-type');

			if (!res.ok) {
				const errorText = await res.text();
				Alert.alert(t('serverError'), errorText);
				return false
			}

			if (
				contentType && !contentType.includes('application/pdf')
			) {
				const rawText = await res.text();
				Alert.alert(t('serverResponse'), rawText);
				return false
			}

			const blob = await res.blob();
			const base64_data = await new Promise<string>(
				(resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(
						(reader.result as string).split(',')[1]
					);
					reader.onerror = reject;
					reader.readAsDataURL(blob)
			});
			await FileSystem.writeAsStringAsync(pdf_uri, base64_data, {
				encoding: FileSystem.EncodingType.Base64
			})
		}

		if (await Sharing.isAvailableAsync()) {
			Sharing.shareAsync(pdf_uri)
		};

		await FileSystem.deleteAsync(uri, { idempotent: true });
		return true

	} else {
		Alert.alert(':(', t('craftError'));
		return false
	}
}