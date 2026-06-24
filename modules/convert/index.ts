// @/modules/convert (pdfcraft-mobile)

import { requireOptionalModule } from 'expo';

const Convert = requireOptionalModule('Convert');

export async function localConvert (
	docxPath: string, outputPath: string
): Promise<boolean> {

	if (!Convert) return false;
	try {
		const cleanDocx = docxPath.replace('file://', '');
		const cleanOutput = outputPath.replace('file://', '');
		return await Convert.convert(cleanDocx, cleanOutput);
	} catch () { return false }
}