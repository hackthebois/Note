import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Discord } from "@/lib/icons/Discord";
import { Mail } from "@/lib/icons/Mail";
import { socials } from "@recordscratch/lib";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as React from "react";
import { ScrollView, View } from "react-native";

function RouteComponent() {
	const openUrl = async (url: string) => {
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		}
	};

	return (
		<ScrollView contentContainerClassName="p-4 gap-10">
			<Stack.Screen
				options={{
					title: "Support",
				}}
			/>
			<Text className="text-lg">
				Need help with RecordScratch? We're here to assist you. Choose your preferred method
				of contact below.
			</Text>
			<View className="gap-4 items-start">
				<Text variant="h2">Discord Community</Text>
				<Text className="text-xl">Join our Discord community for:</Text>
				<View>
					<Text className="text-muted-foreground text-lg">
						• Real-time support from our team and community
					</Text>
					<Text className="text-muted-foreground text-lg">
						• Feature discussions and suggestions
					</Text>
					<Text className="text-muted-foreground text-lg">• Bug reports</Text>
					<Text className="text-muted-foreground text-lg">
						• Connect with fellow music lovers
					</Text>
				</View>
				<Button
					variant="outline"
					onPress={() => openUrl(socials.discord)}
					className="flex-row items-center gap-3"
				>
					<Discord size={18} />
					<Text>Join our Discord</Text>
				</Button>
			</View>
			<View className="gap-4 items-start">
				<Text variant="h2">Email Support</Text>
				<Text className="text-lg">
					For other inquiries, you can reach us via email. We typically respond within
					24-48 hours.
				</Text>
				<Button
					onPress={() => openUrl(`mailto:${socials.email}`)}
					variant="outline"
					className="flex-row items-center gap-3"
				>
					<Mail className="text-muted-foreground" size={20} />
					<Text>Send us an Email</Text>
				</Button>
				<Text className="text-muted-foreground text-lg">
					Alternatively, copy our email address: {socials.email}
				</Text>
			</View>
		</ScrollView>
	);
}

export default RouteComponent;
