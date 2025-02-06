import { ReviewsList } from "@/components/ReviewsList";
import { WebWrapper } from "@/components/WebWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const tabs = ["recent", "popular", "following"];

const FeedPage = () => {
	const router = useRouter();
	const params = useLocalSearchParams<{ tab?: string }>();
	const tab = params.tab && tabs.includes(params.tab) ? params.tab : "recent";

	return (
		<>
			<Stack.Screen
				options={{
					title: "Feed",
				}}
			/>
			<WebWrapper>
				<Tabs
					value={tab}
					onValueChange={(value) => {
						router.setParams({
							tab: value === "recent" ? undefined : value,
						});
					}}
					className="sm:mt-4"
				>
					<View className="px-4">
						<TabsList className="w-full flex-row">
							<TabsTrigger value="recent" className="flex-1">
								<Text>Recent</Text>
							</TabsTrigger>
							<TabsTrigger value="popular" className="flex-1">
								<Text>Popular</Text>
							</TabsTrigger>
							<TabsTrigger value="following" className="flex-1">
								<Text>Following</Text>
							</TabsTrigger>
						</TabsList>
					</View>
				</Tabs>
			</WebWrapper>
			<ReviewsList
				limit={20}
				filters={{
					following: tab === "following",
					popular: tab === "popular",
					ratingType: "REVIEW",
				}}
				emptyText={
					tab === "friends"
						? "No following reviews found. Follow some friends to see their reviews."
						: "No for you reviews found. Check back later."
				}
			/>
		</>
	);
};

export default FeedPage;
