import { api } from "#/utils/api";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const IndexPage = () => {
	const { data: needsOnboarding } = api.profiles.needsOnboarding.useQuery();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (isMounted) {
			if (!needsOnboarding) {
				router.replace("/home");
			} else {
				router.replace("/onboard");
			}
		}
	}, [isMounted, needsOnboarding, router]);

	return (
		<View className="mx-auto flex min-h-[100svh] w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 sm:p-6">
			<Stack.Screen
				options={{
					headerTitle: ``,
				}}
			/>
			<FontAwesome6 name="compact-disc" size={24} color="black" />
		</View>
	);
};

export default IndexPage;
