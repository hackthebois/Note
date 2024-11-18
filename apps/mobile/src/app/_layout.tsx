import {
	Montserrat_100Thin,
	Montserrat_200ExtraLight,
	Montserrat_300Light,
	Montserrat_400Regular,
	Montserrat_500Medium,
	Montserrat_600SemiBold,
	Montserrat_700Bold,
	Montserrat_800ExtraBold,
	Montserrat_900Black,
	useFonts,
} from "@expo-google-fonts/montserrat";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Stack, useNavigationContainerRef } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SplashScreen } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { TRPCProvider } from "~/lib/api";
import { AuthProvider } from "~/lib/auth";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import "../styles.css";
import env from "~/env";
import * as Updates from "expo-updates";
import { catchError } from "~/lib/errors";

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "auth",
};

const timeoutPromise = new Promise<void>((_, reject) => {
	setTimeout(() => {
		reject(new Error("Timeout error"));
	}, 5000);
}).catch(() => {});

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
	dsn: "https://2648bda3885c4f3b7ab58671e8a9d44f@o4508287201312768.ingest.us.sentry.io/4508287205441536",
	debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
	integrations: [
		new Sentry.ReactNativeTracing({
			// Pass instrumentation to be used as `routingInstrumentation`
			routingInstrumentation,
			enableNativeFramesTracking: !isRunningInExpoGo(),
			// ...
		}),
	],
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [fontLoaded, fontError] = useFonts({
		Montserrat_100Thin,
		Montserrat_200ExtraLight,
		Montserrat_300Light,
		Montserrat_400Regular,
		Montserrat_500Medium,
		Montserrat_600SemiBold,
		Montserrat_700Bold,
		Montserrat_800ExtraBold,
		Montserrat_900Black,
	});
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const ref = useNavigationContainerRef();
	const [updatesHandled, setUpdatesHandled] = useState(false);

	useEffect(() => {
		const preload = async () => {
			if (env.ENV !== "development") {
				try {
					const update = await Promise.race([
						Updates.checkForUpdateAsync(),
						timeoutPromise,
					]);
					if (update && update.isAvailable) {
						await Updates.fetchUpdateAsync();
						await Updates.reloadAsync();
					}
				} catch (error) {
					catchError(error);
				}
			}
		};
		preload().finally(() => setUpdatesHandled(true));
	}, []);

	useEffect(() => {
		if (ref?.current) {
			routingInstrumentation.registerNavigationContainer(ref);
		}
	}, [ref]);

	useEffect(() => {
		(async () => {
			const theme = await SecureStore.getItemAsync("theme");
			if (!theme) {
				await SecureStore.setItemAsync("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);

				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		})();
	}, []);

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (fontError) throw fontError;
	}, [fontError]);

	if (!fontLoaded || !isColorSchemeLoaded || !updatesHandled) {
		return null;
	}

	return (
		<AuthProvider>
			<TRPCProvider>
				<SafeAreaProvider>
					<ThemeProvider
						value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
					>
						<Stack
							screenOptions={{
								animation: "fade",
								headerBackTitleVisible: false,
								headerTitle: (props) => (
									<Text variant="h4">{props.children}</Text>
								),
							}}
						>
							<Stack.Screen
								name="(tabs)"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="(auth)/signin"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="(auth)/onboard"
								options={{
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="(modals)/rating"
								options={{
									title: "",
									presentation: "modal",
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="(modals)/reply/rating"
								options={{
									title: "",
									presentation: "modal",
									animation: "slide_from_bottom",
								}}
							/>
							<Stack.Screen
								name="(modals)/reply/comment"
								options={{
									title: "",
									presentation: "modal",
									animation: "slide_from_bottom",
								}}
							/>
						</Stack>
						<PortalHost />
					</ThemeProvider>
				</SafeAreaProvider>
			</TRPCProvider>
		</AuthProvider>
	);
};

export default Sentry.wrap(RootLayout);
