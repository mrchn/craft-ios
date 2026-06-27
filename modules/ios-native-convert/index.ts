// @/modules/ios-native-convert (pdfcraft-mobile)

import IosNativeConvertModule from './src/IosNativeConvertModule';

export async function localConvert(
	docxPath: string, outputPath: string
): Promise<boolean> {
	if (!IosNativeConvertModule) { return false }
	try {
		const cleanDocx = docxPath.replace('file://', '');
		const cleanOutput = outputPath.replace('file://', '');
		return await IosNativeConvertModule.convert(cleanDocx, cleanOutput);
	} catch { return false }
}