// @/app/_layout

import '@/locales'
import { useEffect } from 'react'
import { Slot } from 'expo-router'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, Settings } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
	DarkTheme, DefaultTheme, ThemeProvider
} from '@react-navigation/native'

export default function RootLayout() {

	const config = Constants.expoConfig
	useEffect(() => { Settings.set({
			app_version: config?.version ?? 'undefined',
			app_build_number: config?.ios?.buildNumber ?? 'undefined'
	}) }, [])

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider
				value={
					useColorScheme() === 'dark'
						? DarkTheme
						: DefaultTheme
				}
			>
				<Slot/><StatusBar style='auto'/>
			</ThemeProvider>
		</GestureHandlerRootView>
	)
}