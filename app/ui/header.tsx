// @/app/ui/header

import React, {useState, useRef} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { home as theme } from '@/app/ui/theme';
import {
	TextInput, Animated, View, LayoutAnimation,
	Pressable, useColorScheme, Text } from 'react-native';

// описываем типы для пропсов хедера
interface HeaderProps {
	query: string;
	set_query: (text: string) => void
}

export const HeaderSearch = ({ query, set_query }: HeaderProps) => {

	// dynamic theme
	const system_scheme = useColorScheme();
	const theme_mode:ThemeType=system_scheme==='dark'?'dark':'light';
	const sx = theme(theme_mode);

	const [is_search_focused, set_is_search_focused] = useState(false);
	const search_ref = useRef<TextInput>(null);

	// анимации поиска
	const on_focus = () => { // тыкаем на поиск
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setTimeout(() => {
		set_is_search_focused(true);
	}, 50);
	};

	const on_cancel = () => { // закрываем поиск
		set_query('');
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setTimeout(() => {
		set_is_search_focused(false);
		search_ref.current?.blur();
	}, 50);
	};

	return (
		<View style={sx.search_row}>
			<View style={sx.search_blur}>
				<Ionicons
					name='search' size={16}
					color={sx.title.color}
					style={{ marginLeft: 20 }}
				/>
				<TextInput
					ref={search_ref} style={sx.search_input}
					placeholder='search for templates...'
					onFocus={on_focus}
					placeholderTextColor={sx.title.color}
					value={query} onChangeText={set_query}
					onBlur={() => !query && on_cancel()}
					returnKeyType='search' clearButtonMode='never'
					selectionColor={sx.cancel_text.color}
				/>
			</View>
			<View
				style={{
					width: is_search_focused ? 72 : 0,
					opacity: is_search_focused ? 1 : 0,
					overflow: 'hidden'
				}}
			>
				<Pressable onPress={on_cancel} style={sx.cancel_btn}>
					<Text style={sx.cancel_text}>cancel</Text>
				</Pressable>
			</View>
		</View>
	);
}

export default function Route() { return null }