// @/app/index

import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, Text, useColorScheme } from 'react-native';

import { DocumentList } from '@/app/ui/list';
import { HeaderSearch } from '@/app/ui/header';
import { home as theme } from '@/app/ui/theme';

export default function HomeScreen() {
	const mode = useColorScheme() === 'dark' ? 'dark' : 'light';
	const sx = theme(mode);
	const insets = useSafeAreaInsets();
	const [query, set_query] = useState('');
	const [has_docs, set_has_docs] = useState(false);

	return (
	<View style={[sx.root, { paddingTop: insets.top }]}>
		<View style={sx.header}>
			<Text style={sx.title}>Ready to craft</Text>
		</View>
		{has_docs && (
		<Animated.View
			entering={FadeIn.duration(250)}
			exiting={FadeOut.duration(200)}>
			<HeaderSearch query={query} set_query={set_query}/>
		</Animated.View>
		)}
		<DocumentList
			query={query}
			on_count_change={(count) => set_has_docs(count > 0)}/>
	</View>
	);
}