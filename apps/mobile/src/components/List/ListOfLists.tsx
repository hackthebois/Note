import { ListsType } from "@recordscratch/types";
import { FlatList, Pressable, View, useWindowDimensions } from "react-native";
import ListImage from "./ListImage";
import React from "react";
import { Text } from "../ui/text";
import ReLink from "../ReLink";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";

const ListsItem = ({
	listsItem,
	size,
	onPress,
	showLink,
}: {
	listsItem: ListsType;
	size: number;
	onPress?: (listId: string) => void;
	showLink?: boolean;
}) => {
	const router = useRouter();
	if (!listsItem.id || !listsItem.profile) return null;
	const listResources = listsItem.resources;

	const ListItemContent = (
		<View className="flex flex-col justify-center">
			<View
				style={{
					width: size,
					height: size,
					maxWidth: size,
					maxHeight: size,
				}}
				className="flex items-center justify-center"
			>
				<ListImage listItems={listResources} category={listsItem.category} size={size} />
			</View>
			<Text className="truncate pl-1 pt-1 text-center text-md font-medium">
				{listsItem.name}
			</Text>
		</View>
	);

	return (
		<View
			style={{
				width: size,
			}}
		>
			{
				<Pressable
					onPress={() => {
						if (onPress) {
							onPress(listsItem.id);
						}
						if (showLink) router.push(`/lists/${listsItem.id}`);
					}}
					className="flex w-full cursor-pointer flex-col"
				>
					{ListItemContent}
				</Pressable>
			}
		</View>
	);
};
const ListOfLists = ({
	size = 125,
	showLink = true,
	orientation,
	onPress,
	lists,
	HeaderComponent,
	FooterComponent,
	LastItemComponent,
	EmptyComponent,
}: {
	size?: number;
	showLink?: boolean;
	orientation?: "vertical" | "horizontal";
	onPress?: (listId: string) => void;
	lists: ListsType[] | undefined;
	HeaderComponent?: React.ReactNode;
	FooterComponent?: React.ReactNode;
	LastItemComponent?: React.ReactNode;
	EmptyComponent?: React.ReactNode;
}) => {
	const dimensions = useWindowDimensions();
	let listoflists;
	if (LastItemComponent) {
		const emptyList: ListsType = {
			id: "",
			userId: "",
			name: "",
			category: "ALBUM",
			resources: [],
			profile: null,
		};
		listoflists = [...(lists || []), emptyList];
	} else listoflists = lists;

	if (orientation === "vertical") {
		return (
			<FlatList
				ListHeaderComponent={() => HeaderComponent}
				ListFooterComponent={() => FooterComponent}
				ListEmptyComponent={() => EmptyComponent}
				data={listoflists}
				keyExtractor={(index) => index.id}
				renderItem={({ item }) => {
					if (item.id === "") return <>{LastItemComponent}</>;
					return (
						<ListsItem
							listsItem={item}
							size={dimensions.width / 3.25}
							onPress={onPress}
							showLink={showLink}
						/>
					);
				}}
				columnWrapperStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginVertical: 10,
					gap: 10,
					marginLeft: 5,
				}}
				keyboardShouldPersistTaps="always"
				keyboardDismissMode="interactive"
				numColumns={3}
				scrollEnabled={true}
				horizontal={false}
				showsVerticalScrollIndicator={false}
			/>
		);
	}
	return (
		<FlatList
			data={lists}
			keyExtractor={(index) => index.id}
			renderItem={({ item }) => (
				<ListsItem listsItem={item} size={size} onPress={onPress} showLink={showLink} />
			)}
			contentContainerStyle={{
				flexDirection: "row",
				gap: 17,
				marginVertical: 16,
			}}
			style={{ marginLeft: -8 }}
			showsHorizontalScrollIndicator={false}
			horizontal={true}
			ListFooterComponent={() => FooterComponent}
			ListHeaderComponent={() => HeaderComponent}
		/>
	);
};

export default ListOfLists;
