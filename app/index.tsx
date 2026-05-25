// @/app/index
import React, {useState, useRef} from 'react';
import {View, Text, TextInput} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {DocumentList} from '@/app/ui/list';
import {useAppTheme, home as theme} from '@/app/ui/theme';
import {useTranslation} from 'react-i18next';

export default function HomeScreen() {
	const {t} = useTranslation();
	const sx = useAppTheme(theme);
	const [query, set_query] = useState('');
	const [has_docs, set_has_docs] = useState(false);
	const search_ref = useRef<TextInput>(null);
	return (
	<View style={[sx.root, {paddingTop: useSafeAreaInsets().top}]}>
		<View style={sx.header}>
			<Text style={sx.title}>Ready to craft</Text>
		</View>
		{has_docs && (
		<Animated.View
			entering={FadeIn.duration(250)}
			exiting={FadeOut.duration(200)}>
			<View style={sx.search_row}>
				<View style={sx.search}>
					<Ionicons
						name='search' size={16}
						color={sx.title.color}
						style={{ marginLeft: 20 }}
					/>
					<TextInput
						ref={search_ref} style={sx.search_input}
						placeholder={t('search')}
						placeholderTextColor={sx.title.color}
						value={query} onChangeText={set_query}
						returnKeyType='search' clearButtonMode='never'
						selectionColor={sx.cancel_text.color}
					/>
				</View>
			</View>
		</Animated.View>
		)}
		<DocumentList
			query={query}
			on_count_change={(count) => set_has_docs(count > 0)}/>
	</View>
	)
}