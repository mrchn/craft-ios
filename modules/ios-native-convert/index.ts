// @/modules/ios-native-convert/index.ts (pdfcraft-mobile)

import convertModule from './src/IosNativeConvertModule';

export async function localConvert(
	docxPath: string, outputPath: string
): Promise<boolean> {
	try {
		return await convertModule.convert(
			docxPath.replace('file://', ''),
			outputPath.replace('file://', '')
		)
	} catch { return false }
}