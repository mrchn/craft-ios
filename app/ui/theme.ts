// @/app/ui/theme

import {StyleSheet, Platform} from 'react-native';

export const Colors = {

	light: {
		bg: '#F2F2F7',
		text: '#000000',
		accent: '#007AFF',
		card: '#FFFFFF',
		info: '#8E8E93'

	}, dark: {
		bg: '#000000',
		text: '#FFFFFF',
		accent: '#0A84FF',
		card: '#1C1C1E',
		info: '#8E8E93'
	}

} as const;

export type ThemeType = 'light' | 'dark';
const cache: Record<string, any> = {};

export const home = (mode: ThemeType) => {

	const key = `home_${mode}`;
	if (cache[key]) return cache[key];
	const c = Colors[mode];
	return (cache[key] = StyleSheet.create({

		root: {
			flex: 1,
			backgroundColor: c.bg
		},
		header: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'space-between',
			paddingHorizontal: 20,
			paddingTop: 44,
			paddingBottom: 16
		},
		title: {
			color: c.text,
			fontSize: 32,
			fontFamily: 'ui-monospace'
		},
		header_btn: {
			paddingBottom: 4
		},
		search_row: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 16,
			marginBottom: 16,
			gap: 8
		},
		search_blur: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			borderRadius: 16,
			height: 48,
			borderWidth: 1,
			borderColor: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.15)',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: mode === 'light' ? 0.06 : 0.2,
			shadowRadius: 8,
		},
		search_input: {
			flex: 1,
			color: c.text,
			paddingHorizontal: 16,
			paddingVertical: 0,
			fontFamily: 'ui-monospace',
			fontSize: 17
		},
		cancel_btn: {
			paddingHorizontal: 8
		},
		cancel_text: {
			color: c.accent,
			fontSize: 14,
			fontFamily: 'ui-monospace'
		},
		list_header: {
			marginBottom: 8
		},
		list_content: {
			flexGrow: 1,
			paddingHorizontal: 16,
			paddingBottom: 100
		},
		section_label: {
			color: c.info,
			fontSize: 13,
			fontFamily: 'ui-monospace',
			lineHeight: 16, letterSpacing: 0.5,
			paddingLeft: 16, marginBottom: 6
		},

		// LIST ROWS
		row: {
			borderWidth: StyleSheet.hairlineWidth,
			borderColor: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
			backgroundColor: c.card,
			flexDirection: 'row', alignItems: 'center',
			paddingVertical: 14, paddingHorizontal: 16
		},
		icon_wrap: {
			backgroundColor: c.accent, borderRadius: 8,
			width: 36, height: 36, marginRight: 12,
			alignItems: 'center', justifyContent: 'center',
		},
		row_meta: { flex: 1 },
		row_title: {
			color: c.text, fontSize: 17,
			marginBottom: 2, fontWeight: '400',
			fontFamily: 'ui-monospace'
		},
		row_sub: {
			color: c.info, fontSize: 12, fontWeight: '400'
		},
		empty: {
			flex: 1, alignItems: 'center', justifyContent: 'center',
			paddingBottom: 80, gap: 12
		},
		empty_text: {
			color: c.info, fontSize: 14, fontFamily: 'ui-monospace'
		},

		// FAB
		fab: {
			position: 'absolute', bottom: 32, right: 24,
			width: 56, height: 56,
			borderRadius: 28,
			backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 46, 0.6)',
			borderWidth: 1,
			borderColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)',
			alignItems: 'center', justifyContent: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: mode === 'light' ? 0.12 : 0.3,
			shadowRadius: 12,
		}
	}))
};

export const form = (mode: ThemeType) => {
	const key = `form_${mode}`;
	if (cache[key]) return cache[key];
	const c = Colors[mode];
	return (cache[key] = StyleSheet.create({

		safe: {
			flex: 1,
			backgroundColor: mode === 'light' ? '#F2F2F7' : '#1C1C1E'
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center', padding: 20
		},
		scroll_content: {
			padding: 20
		},
		section_title: {
			fontFamily: 'ui-monospace',
			color: c.text, fontSize: 22,
			marginTop: 20, marginBottom: 10,
		},
		fields_empty: {
			color: c.info,
			marginTop: 10, textAlign: 'center'
		},

		// TEXT FIELDS
		input: {
			backgroundColor: 'rgba(255, 255, 255, 0.06)',
			color: c.text,
			padding: 16,
			marginBottom: 12,
			borderRadius: 14,
			fontSize: 17,
			borderWidth: 1,
			borderColor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
		},
		// FILLED BUTTON — m3 primary action
		submit_btn_wrap: {
			paddingHorizontal: 20,
			paddingBottom: Platform.OS === 'ios' ? 50 : 20,
		},
		submit_btn: {
			alignSelf: 'center', backgroundColor: c.text,
			paddingVertical: 16,
			borderRadius: 16, alignItems: 'center',
			justifyContent: 'center',
			marginTop: 20, width: '100%',

			borderWidth: 1,
			borderColor: mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
			shadowColor: c.accent,
	shadowOffset: { width: 0, height: 6 },
	shadowOpacity: mode === 'light' ? 0.25 : 0.4,
	shadowRadius: 12,
		},
		submit_text: {
			color: c.bg, fontSize: 17, fontWeight: '600',
			fontFamily: 'ui-monospace',
		},
		indicator: {
			position: 'absolute', top: 0, left: 0,
			right: 0, bottom: 0, alignItems: 'center',
			backgroundColor: 'rgba(0,0,0,0.0)',
			justifyContent: 'center', zIndex: 9999
		},
		indicator_text: {
			color: c.text,
			marginTop: 16, fontFamily: 'ui-monospace'
		}
	}))
};

export default function Route() { return null }