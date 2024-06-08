import React, { useLayoutEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { useNavigation } from "expo-router";
import { ArrowLeft, Search } from "lucide-react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDebounce } from "@recordscratch/lib";
import MusicSearch from "@/components/MusicSearch";
import ProfileSearch from "@/components/ProfileSearch";
import { TouchableOpacity } from "react-native-ui-lib";

const SearchInput = ({ query, setQuery }: { query: string; setQuery: (_: string) => void }) => {
	const navigation = useNavigation();
	return (
		<View className="flex-row items-center mt-2 px-4">
			<TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
				<ArrowLeft />
			</TouchableOpacity>
			<View className="flex-row items-center border border-gray-300 rounded-md w-5/6">
				<Search size={20} className="ml-2 text-gray-500" />
				<TextInput
					id="name"
					autoComplete="off"
					placeholder="Search"
					value={query}
					className="flex-1 bg-transparent p-2 pl-2 text-lg outline-none"
					onChangeText={(text) => setQuery(text)}
				/>
			</View>
		</View>
	);
};

const Results = ({ children }: { children: React.ReactNode }) => {
	return <ScrollView className="mt-3">{children}</ScrollView>;
};

export default function SearchLayout() {
	const Tab = createMaterialTopTabNavigator();
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			header: () => <SearchInput query={query} setQuery={setQuery} />,
		});
	}, [navigation, query]);

	return (
		<View className="flex flex-1">
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: {
						justifyContent: "center",
					},
					tabBarItemStyle: {
						width: "auto",
						alignItems: "center",
						flex: 1,
					},
					tabBarLabelStyle: {
						textAlign: "center",
					},
					tabBarScrollEnabled: true,
				}}
			>
				<Tab.Screen
					name="Top Results"
					children={() => (
						<Results>
							<MusicSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
						</Results>
					)}
				/>
				<Tab.Screen
					name="Profiles"
					children={() => (
						<Results>
							<ProfileSearch query={debouncedQuery} onNavigate={() => setQuery("")} />
						</Results>
					)}
				/>
				<Tab.Screen
					name="Albums"
					children={() => (
						<Results>
							<MusicSearch
								query={debouncedQuery}
								onNavigate={() => setQuery("")}
								hide={{ songs: true, artists: true }}
							/>
						</Results>
					)}
				/>
				<Tab.Screen
					name="Artists"
					children={() => (
						<Results>
							<MusicSearch
								query={debouncedQuery}
								onNavigate={() => setQuery("")}
								hide={{ songs: true, albums: true }}
							/>
						</Results>
					)}
				/>
				<Tab.Screen
					name="Songs"
					children={() => (
						<Results>
							<MusicSearch
								query={debouncedQuery}
								onNavigate={() => setQuery("")}
								hide={{ artists: true, albums: true }}
							/>
						</Results>
					)}
				/>
			</Tab.Navigator>
		</View>
	);
}
