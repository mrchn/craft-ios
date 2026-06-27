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

			if (!podfileContent.includes('ios_native_convert')) {
				const rubyCode = `
at_exit do
  providers = Dir.glob(File.join(__dir__, 'Pods', 'Target Support Files', 'Pods-*', 'ExpoModulesProvider.swift'))
  providers.each do |provider|
    content = File.read(provider)
    unless content.include?('ios_native_convert')
      content.gsub!('import ExpoModulesCore', "import ExpoModulesCore\\nimport ios_native_convert")
      content.gsub!(/func getModuleClasses.*?return\\s*\\[/m) { |match| "\#{match}\\n      IosNativeConvertModule.self," }
      File.write(provider, content)
      puts "(!) IosNativeConvertModule registered in ExpoModulesProvider.swift"
    end
  end
end`;

				podfileContent += `\n${rubyCode}\n`;
				changed = true;
				console.log('(!) Safe at_exit hook appended to Podfile');
			}

			if (changed) {
				fs.writeFileSync(podfilePath, podfileContent, 'utf8');
			}
			return config;
		}
	]);
};