import { Button } from "@/components/Button";
import Metadata from "@/components/Metadata";
import { ResourceItem } from "@/components/ResourceItem";
import { Text } from "@/components/Text";
import { api } from "@/utils/api";
import { getQueryOptions } from "@/utils/deezer";
import { formatDuration } from "@recordscratch/lib";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotFound from "../+not-found";

const SignIn = () => {
	const [profile] = api.profiles.me.useSuspenseQuery();
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();

	// if (needsOnboarding) {
	// 	navigate({
	// 		to: "/onboard",
	// 	});
	// }

	if (!profile) {
		return <a href="/auth/google">Sign In</a>;
	}
};

const AlbumOfTheDay = () => {
	const [albumOfTheDay] = api.misc.albumOfTheDay.useSuspenseQuery();
	const { data: album } = useSuspenseQuery(
		getQueryOptions({
			route: "/album/{id}",
			input: { id: albumOfTheDay.albumId },
		})
	);

	if (!album) return <NotFound />;

	return (
		<Metadata
			title={album.title}
			cover={album.cover_big}
			type="ALBUM OF THE DAY"
			tags={[
				album.release_date,
				album.duration ? `${formatDuration(album.duration)}` : undefined,
				...(album.genres?.data.map((genre: { name: any }) => genre.name) ?? []),
			]}
		>
			<></>
		</Metadata>
	);
};

const HomePage = () => {
	const [trending] = api.ratings.trending.useSuspenseQuery();
	const [top] = api.ratings.top.useSuspenseQuery();

	const { setColorScheme, colorScheme } = useColorScheme();

	return (
		<SafeAreaView
			style={{
				flex: 1,
			}}
			edges={["top", "left", "right"]}
		>
			<ScrollView contentContainerClassName="flex flex-col" nestedScrollEnabled>
				<AlbumOfTheDay />
				<View className="flex flex-col gap-2">
					<Text variant="h1" className="dark:text-white px-4 mt-4">
						Trending
					</Text>
					<FlatList
						data={trending}
						renderItem={({ item }) => (
							<ResourceItem
								direction="vertical"
								resource={{
									resourceId: item.resourceId,
									category: "ALBUM",
									parentId: "",
								}}
							/>
						)}
						horizontal
						contentContainerClassName="gap-4 px-4 pb-4"
					/>
				</View>
				<View className="flex flex-col gap-2">
					<Text variant="h1" className="px-4">
						Top Albums
					</Text>
					<FlatList
						data={top}
						renderItem={({ item }) => (
							<ResourceItem
								direction="vertical"
								resource={{
									resourceId: item.resourceId,
									category: "ALBUM",
									parentId: "",
								}}
							/>
						)}
						horizontal
						contentContainerClassName="gap-4 px-4 pb-4"
					/>
				</View>

				<Button
					label="Toggle mode"
					variant="secondary"
					onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomePage;
