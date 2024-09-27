import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";

const SettingsPage = () => {
	const { logout, profile } = useAuth((s) => ({ logout: s.logout, profile: s.profile }));
	const { setColorScheme, colorScheme } = useColorScheme();

	return (
		<View className="p-4 gap-4">
			<Stack.Screen
				options={{
					title: "Settings",
				}}
			/>
			<Button
				variant="destructive"
				onPress={async () => {
					fetch("https://recordscratch.app/auth/signout");
					logout();
				}}
			>
				<Text>Sign out</Text>
			</Button>

			<Button
				variant="secondary"
				onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
			>
				<Text>Toggle mode</Text>
			</Button>
		</View>
	);
};

export default SettingsPage;
