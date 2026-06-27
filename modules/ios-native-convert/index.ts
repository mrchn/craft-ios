// @/modules/ios-native-convert (pdfcraft-mobile)

import IosNativeConvertModule from './src/IosNativeConvertModule.ts';

export async function localConvert(
	docxPath: string, outputPath: string
): Promise<boolean> {
	try {
		const cleanDocx = docxPath.replace('file://', '');
		const cleanOutput = outputPath.replace('file://', '');
		return await IosNativeConvertModule.convert(cleanDocx, cleanOutput);
	} catch { return false }
}