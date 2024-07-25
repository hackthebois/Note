import React, { useEffect, useLayoutEffect, useState } from "react";
import { View } from "react-native";
import * as Browser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useAuth } from "~/lib/Authentication";
import { Button } from "~/components/CoreComponents/Button";
import { Text } from "~/components/CoreComponents/Text";

Browser.maybeCompleteAuthSession();
const AuthPage = () => {
	const { sessionId, login } = useAuth();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useLayoutEffect(() => {
		if (isMounted && sessionId) {
			router.replace("/");
		}
	}, [isMounted, sessionId, router]);

	const _handlePressButtonAsync = async () => {
		const result = await Browser.openAuthSessionAsync(
			`${process.env.EXPO_PUBLIC_CF_PAGES_URL}/auth/google?mobile=true`,
			`${process.env.EXPO_PUBLIC_URL}`
		);
		if (result.type !== "success") return;

		const url = Linking.parse(result.url);
		const sessionId = url.queryParams?.session_id?.toString() ?? null;
		if (!sessionId) return;
		login(sessionId);
	};

	return (
		<View className="flex-1 justify-center items-center bg-white">
			<Text className="font-semibold mb-4" variant="h2">
				Welcome to RecordScratch!
			</Text>
			<Button
				className=" rounded-md px-4 py-2"
				onPress={_handlePressButtonAsync}
				label="Sign In"
				variant="secondary"
			/>
		</View>
	);
};

export default AuthPage;
