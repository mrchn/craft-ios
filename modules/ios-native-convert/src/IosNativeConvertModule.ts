// @/modules/ios-native-convert/src/IosNativeConvertModule.ts

import { NativeModule, requireNativeModule } from 'expo-modules-core';

interface IosNativeConvertModule {
	convert(docxPath: string, outputPath: string): Promise<boolean>
}

let mod: IosNativeConvertModule;
try { mod = requireNativeModule<IosNativeConvertModule>('IosNativeConvert') }
catch { mod = { convert: async () => false } }

export default mod;