// @/app/pdfcraft

import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

const SECRET = 'YOUR_SUPER_SECRET_SALT';

export const gen_doc_id = (): string => {
	const year = new Date().getFullYear().toString().slice(-2);
	const bytes = Crypto.getRandomBytes(2);
	const hex = bytes[0]
		.toString(16).padStart(2, '0') + bytes[1]
		.toString(16).padStart(2, '0');
	return `${year}${hex}`.toUpperCase()
};

export const gen_sig_hash = async (
	u_id: string, doc_id: string, date: string
	): Promise<string> => {
	const data = `${u_id}:${doc_id}:${date}:${SECRET}`;
	const hash = await Crypto.digestStringAsync(
		Crypto.CryptoDigestAlgorithm.SHA256, data
		);
	return hash.toUpperCase()
};

export const parse_docx = async (uri: string): Promise<string[]> => {
	try {
		const base64 = await FileSystem.readAsStringAsync(
			uri, { encoding: 'base64' }
			);
		const zip = await JSZip.loadAsync(base64, { base64: true });
		const xml = await zip.file('word/document.xml')
			?.async('text');
		if (!xml) { return [] };
		const clean_text = xml.replace(/<[^>]+>/g, '');
		const matches = clean_text.match(/\{\{(.+?)\}\}/g) || [];
		const res = Array.from(
			new Set(matches.map(m => {
				return m.replace(/[\{\}\s\xa0]/g, '')
			}))).filter(Boolean);
		return res
	} catch { return [] }
};

export const gen_docx = async (
	template_uri: string,
	data: Record<string, string>,
	original_title: string) => {
	try {
		const base64 = await FileSystem.readAsStringAsync(
			template_uri, { encoding: 'base64' }
			);
		const zip = await JSZip.loadAsync(base64, { base64: true });
		let doc_xml = await zip.file('word/document.xml')
			?.async('text');
		if (!doc_xml) return null;
		Object.entries(data).forEach(([key, value]) => {
			const xml_tag = '(?:<[^>]+>)*';
			const escaped_key = key.split('')
				.map(char => char.replace(
					/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
					)).join(xml_tag);
			const regex_str =
				`\\{${xml_tag}\\{${xml_tag}\\s*${xml_tag}` +
				`${escaped_key}` +
				`\\s*${xml_tag}\\}${xml_tag}\\}`;
			const regex = new RegExp(regex_str, 'g');
			doc_xml = doc_xml!.replace(regex, value);
		});
		zip.file('word/document.xml', doc_xml);
		const output_base64 = await zip.generateAsync({
			type: 'base64'
		});
		const new_title = `crafted_${original_title}`;
		const new_uri = FileSystem.documentDirectory + new_title;
		await FileSystem.writeAsStringAsync(
			new_uri, output_base64, { encoding: 'base64' }
			);
		return new_uri
	} catch { return null }
};

export default function Route() { return null }