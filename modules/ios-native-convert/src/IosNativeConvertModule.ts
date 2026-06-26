// @/modules/ios-native-convert/src/IosNativeConvertModule.ts (pdfcraft-mobile)

import { NativeModule, requireNativeModule } from 'expo';

declare class IosNativeConvertModule extends NativeModule {
	convert(docxPath: string, outputPath: string): Promise<boolean>
}

export default requireNativeModule<IosNativeConvertModule>('IosNativeConvert')