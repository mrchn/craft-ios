// @/modules/ios-native-convert (pdfcraft-mobile)

import IosNativeConvertModule from './src/IosNativeConvertModule';

export async function localConvert(
	docxPath: string, outputPath: string
): Promise<boolean> {
	try {
		return await IosNativeConvertModule.convert(
			docxPath.replace('file://', ''),
			outputPath.replace('file://', '')
		)
	} catch { return false }
}