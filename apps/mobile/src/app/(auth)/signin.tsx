import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as Browser from "expo-web-browser";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
// import googleLogo from "~/assets/google-logo.svg";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/auth";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const sessionId = useAuth((s) => s.sessionId);
	const setSessionId = useAuth((s) => s.setSessionId);
	const router = useRouter();

	useEffect(() => {
		if (sessionId) {
			router.replace("/");
		}
	}, [sessionId]);

	const handlePressButtonAsync = async () => {
		const result = await Browser.openAuthSessionAsync(
			`${process.env.EXPO_PUBLIC_CF_PAGES_URL}/auth/google?expoAddress=${process.env.EXPO_PUBLIC_URL}`,
			`${process.env.EXPO_PUBLIC_URL}`
		);
		if (result.type !== "success") return;
		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;
		await setSessionId(sessionId);
	};

	return (
		<View className="flex-1 justify-center items-center gap-6">
			<Image
				source={require("../../../assets/icon.png")}
				style={{
					width: 150,
					height: 150,
					borderRadius: 75,
				}}
			/>
			<Text variant="h1" className="text-center">
				Welcome to RecordScratch!
			</Text>
			<Pressable
				onPress={handlePressButtonAsync}
				className="px-8 py-4 rounded-full border border-border flex-row gap-4 items-center"
			>
				<Image
					source={require("../../../assets/google-logo.svg")}
					style={{
						width: 30,
						height: 30,
					}}
				/>
				<Text className="text-lg font-medium">Sign in with Google</Text>
			</Pressable>
		</View>
	);
};

export default AuthPage;
