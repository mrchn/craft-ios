// @/app/index

import React, {
	useState, useEffect, useCallback, useMemo } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as FileSystem from 'expo-file-system/legacy'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
	FadeIn, FadeOut, FadeInDown,
	LinearTransition } from 'react-native-reanimated'
import {
	FlatList, Pressable, View, Text, TextInput,
	ActivityIndicator } from 'react-native'

import { Create, Parse } from '@/craft'
import { useAppTheme, home as theme } from '@/theme'
import { Form, Picker, hapticTap } from '@/components'
import { Doc, PickedProps } from '@/types'

const DB_URI = `${FileSystem.documentDirectory}doc_db.json`

export default function HomeScreen() {
	const { t } = useTranslation()
	const sx = useAppTheme(theme)

	const [query, setQuery] = useState('')
	const [loaded, setLoaded] = useState(false)
	const [docs, setDocs] = useState<Doc[]>([])
	const [form, setForm] = useState(false)
	const [converting, setConverting] = useState(false)
	const [fields, setFields] = useState<string[]>([])
	const [picked, setPicked] = useState<PickedProps>(null)

	const create = async (data: Record<string, string>) => {
		if (!picked) { return }
		setForm(false) ; setConverting(true)
		await Create({doc: picked, data }).catch(() => {})
		setConverting(false) ; setPicked(null)
	}

	useEffect(() => { (async () => { try {
		const saved = await FileSystem.readAsStringAsync(DB_URI)
		if (saved) setDocs(JSON.parse(saved))
	} catch {} finally { setLoaded(true) } })()}, [])

	useEffect(() => { if (loaded) { FileSystem.writeAsStringAsync(
		DB_URI, JSON.stringify(docs)
	).catch(() => {})}}, [docs, loaded])

	const deleteDoc = (id: string) => {
		hapticTap() ; setDocs((p) => p.filter((d) => d.id !== id))
	}

	const { pick, isLoading: isPicking } = Picker({docs, setDocs})

	const filter = useMemo(() => {
		const q = query.toLowerCase()
		return docs.filter((d) => d.title.toLowerCase().includes(q))
	}, [docs, query])

	const render_item = ({ item }: { item: Doc }) => (
		<Animated.View
			entering={FadeInDown.duration(300).springify()}
			layout={LinearTransition.springify()}
			style={sx.item}
		>
		<Swipeable
			renderRightActions={() => (
				<Pressable
					style={sx.swipeDelete}
					onPress={() => deleteDoc(item.id)}>
					<Ionicons name='trash' size={22} color='#FFF'/>
				</Pressable>
			)}
			friction={2} rightThreshold={40}>
			<Pressable
				style={[sx.row]}
				onPress={async () => {
					hapticTap() ; setPicked(item)
					try {
						setFields(await Parse(item.uri))
						setForm(true)
					} catch { setPicked(null) }
				}}
			>
				<View style={sx.icon_wrap}>
					<Ionicons
						name='document-text'
						size={22} color='#1F4E79'/>
				</View>
				<View style={{flex: 1}}>
					<Text style={sx.row_title} numberOfLines={1}>
						{item.title}
					</Text>
					<Text style={sx.row_sub}>
						{item.size} · {item.date}
					</Text>
				</View>
				<Ionicons
					name='chevron-forward' size={16}
					color={sx.title.color} 
					style={{marginLeft: 8}}/>
			</Pressable>
		</Swipeable>
		</Animated.View>
	)

	const insets = useSafeAreaInsets()

	return (
	<View style={[sx.root, {paddingTop: insets.top}]}>
		<View style={sx.header}>
			<Text style={sx.title}>Ready to craft</Text>
		</View>
		{docs.length > 0 && (
		<Animated.View
			entering={FadeIn.duration(250)}
			exiting={FadeOut.duration(200)}>
			<View style={sx.search_row}>
				<View style={sx.search}>
					<Ionicons
						name='search' size={16}
						color={sx.title.color}
						style={{marginLeft: 20}}
					/>
					<TextInput
						style={sx.search_input}
						placeholder={t('search')}
						placeholderTextColor={sx.title.color}
						value={query} onChangeText={setQuery}
						returnKeyType='search' clearButtonMode='never'
						selectionColor={sx.title.color}
					/>
				</View>
			</View>
		</Animated.View>
		)}
		<View style={{flex: 1}}>
			<FlatList
				data={filter} keyExtractor={(d) => d.id}
				renderItem={render_item}
				contentContainerStyle={sx.list_content}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={
					filter.length > 0 ? (
						<Animated.View
							entering={FadeIn.duration(250)}
							exiting={FadeOut.duration(200)}
							style={{marginBottom: 8}}>
							<Text style={sx.section_label}>
	{`${filter.length} DOCUMENT${filter.length === 1 ? '' : 'S'}`}
							</Text>
						</Animated.View>
					) : null
				}
				ListEmptyComponent={
					<View style={sx.empty}>
						<Ionicons
							name='folder-open-outline' size={48}
							color={sx.section_label.color}/>
						<Text style={sx.empty_text}>
							{t('docsNotFound')}
						</Text>
					</View>
				}
			/>
			<Pressable
				style={({ pressed }) => [
					sx.fab, { transform: [{ scale:pressed?0.92:1 }]}
				]}
				onPress={ pick }
				disabled={ converting || isPicking }>
				{ converting || isPicking
				? <ActivityIndicator color={sx.title.color}/>
				: <Ionicons
					name='add' size={32} color={sx.title.color}/>
				}
				</Pressable>
			<Form
				visible={form} fields={fields}
				on_close={() => setForm(false)} on_submit={create}/>
		</View>
	</View>
	)
}