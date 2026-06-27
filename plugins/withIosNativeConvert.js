// @/plugins/withIosNativeConvert.js

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withIosNativeConvert(config) {
	return withDangerousMod(config, [
		'ios',
		async (config) => {
			const iosDir = config.modRequest.platformProjectRoot;
			const podfilePath = path.join(iosDir, 'Podfile');
			if (fs.existsSync(podfilePath)) {
				let podfileContent = fs.readFileSync(podfilePath, 'utf8');
				if (!podfileContent.includes("pod 'ios-native-convert'")) {
					const searchString = "use_expo_modules!";
					podfileContent = podfileContent.replace(
						searchString,
						`use_expo_modules!\n  pod 'ios-native-convert', :path => '../modules/ios-native-convert'`
					);
					fs.writeFileSync(podfilePath, podfileContent, 'utf8');
					console.log('(!) Local pod successfully injected into Podfile')
				}
			}

			const fallbackProviderPath = path.join(iosDir, '.expo', 'ExpoModulesProvider.swift');
			const targetProvider = fs.existsSync(fallbackProviderPath) ? fallbackProviderPath : null;

			if (!targetProvider) {
				console.warn('(!) ExpoModulesProvider.swift not found — module NOT registered');
				return config
			}
			let providerContent = fs.readFileSync(targetProvider, 'utf8');
			if (!providerContent.includes('ios_native_convert')) {
				providerContent = providerContent.replace(
					'import ExpoModulesCore',
					'import ExpoModulesCore\nimport ios_native_convert'
				);
				providerContent = providerContent.replace(
					'return [',
					'return [\n      IosNativeConvertModule.self,'
				);
				fs.writeFileSync(targetProvider, providerContent, 'utf8');
				console.log('(!) Module successfully registered in ExpoModulesProvider.swift')
			}
			return config
		}
	])
}