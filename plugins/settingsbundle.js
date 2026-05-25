// @/plugins/settingsbundle.js

const fs = require('fs');
const path = require('path');
const { withXcodeProject } = require('@expo/config-plugins');

module.exports = function withSettingsBundle(config) {
	return withXcodeProject(config, async (config) => {
		const projectRoot = config.modRequest.projectRoot;
		const iosRoot = config.modRequest.platformProjectRoot;
		const srcDir = path.join(projectRoot, 'ios-settings');
		const destDir = path.join(iosRoot, 'Settings.bundle');
		if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);
		fs.copyFileSync(
			path.join(srcDir, 'Root.plist'),
			path.join(destDir, 'Root.plist')
			);
		const xcodeProject = config.modResults;
		if (!xcodeProject.hasFile('Settings.bundle')) {
			xcodeProject.addResourceFile('Settings.bundle')
		}
		return config
	})
}