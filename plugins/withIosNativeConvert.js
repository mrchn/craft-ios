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

			if (!fs.existsSync(podfilePath)) {
				console.warn('(!) Podfile not found');
				return config;
			}

			let podfileContent = fs.readFileSync(podfilePath, 'utf8');
			let changed = false;

			if (!podfileContent.includes("pod 'ios-native-convert'")) {
				podfileContent = podfileContent.replace(
					'use_expo_modules!',
					`use_expo_modules!\n  pod 'ios-native-convert', :path => '../modules/ios-native-convert'`
				);
				changed = true;
				console.log('(!) Local pod injected into Podfile');
			}

			if (!podfileContent.includes('IosNativeConvertModule')) {
				podfileContent += `
post_install do |installer|
	provider = File.join(__dir__, 'Pods', 'Target Support Files', 'Pods-pdfcraft', 'ExpoModulesProvider.swift')
	next unless File.exist?(provider)
	content = File.read(provider)
	next if content.include?('ios_native_convert')
	content.gsub!('import ExpoModulesCore', "import ExpoModulesCore\\nimport ios_native_convert")
	content.gsub!('return [', "return [\\n      IosNativeConvertModule.self,")
	File.write(provider, content)
	puts '(!) IosNativeConvertModule registered in ExpoModulesProvider.swift'
end
`;
				changed = true;
				console.log('(!) post_install hook injected');
			}

			if (changed) {
				fs.writeFileSync(podfilePath, podfileContent, 'utf8');
			}

			return config;
		}
	]);
};