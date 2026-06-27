// @/modules/ios-native-convert/src/IosNativeConvertModule.ts

import { NativeModule, requireNativeModule } from 'expo-modules-core';

interface IosNativeConvertModule {
	convert(docxPath: string, outputPath: string): Promise<boolean>
}

let mod: IosNativeConvertModule;
let _loadError: string | null = null;

try { mod = requireNativeModule<IosNativeConvertModule>('ios-native-convert') }
catch (e) {
	_loadError = String(e);
	mod = { convert: async () => false }
}

export const moduleLoadError = _loadError;
export default mod