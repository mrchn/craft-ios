// @/craft

import JSZip from 'jszip'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { printToFileAsync } from 'expo-print'
import { ooxml_to_html } from './ooxml2html'
import type { CreateProps } from '@/components'

const getXML = async (uri: string) => {
	return (await JSZip.loadAsync(
		await FileSystem.readAsStringAsync(
			uri, { encoding: 'base64' }
		), { base64: true }
	)).file('word/document.xml')?.async('text')
}

export async function Create({ doc, data }: CreateProps) {
	const uriPDF = `${FileSystem.cacheDirectory}craft.pdf`
	try {
		let xml = await getXML(doc.uri)
		if (!xml) return false
		Object.entries(data).forEach(([key, value]) => {
			const tag = '(?:<[^>]+>)*'
			const esc = key.split('')
				.map(c => c.replace(
					/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
				)).join(tag)
			xml = xml!.replace(new RegExp(
				`\\{${tag}\\{${tag}\\s*${tag}${esc}` +
				`\\s*${tag}\\}${tag}\\}`, 'g'
			), () => value)
		})
		await new Promise(resolve => setTimeout(resolve, 600))
		const { uri: tmp } = await printToFileAsync({
			html:
				`<!DOCTYPE html><html><body style="font-family` +
				`:serif;padding:40px;font-size:14px">` +
				`${ooxml_to_html(xml)}</body></html>`
		})
		await FileSystem.moveAsync({ from: tmp, to: uriPDF })
		Sharing.shareAsync(uriPDF).finally(() => {
			FileSystem.deleteAsync(
				uriPDF, { idempotent: true }
			).catch(() => {})
		})
		return true
	} catch { return false }
}

export const Parse = async (uri: string): Promise<string[]> => {
	try {
		const xml = await getXML(uri)
		if (!xml) return []
		return [...new Set(
			(
				xml.replace(/<[^>]+>/g, '')
					.match(/\{\{([^\{\}]+?)\}\}/g) || []
			)
				.map(m => m.replace(/[\{\}\s\xa0]/g, ''))
				.filter(Boolean)
		)]
	} catch { return [] }
}