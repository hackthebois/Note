import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TextInput, View } from "react-native";
import { z } from "zod";
import NotFoundScreen from "~/app/+not-found";
import { Review } from "~/components/Review";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";

const Reply = () => {
	const router = useRouter();
	const { resourceId, handle } = useLocalSearchParams<{
		resourceId: string;
		handle: string;
	}>();
	const [profile] = api.profiles.get.useSuspenseQuery(handle);
	const [rating] = api.ratings.user.get.useSuspenseQuery({
		userId: profile!.userId,
		resourceId,
	});

	if (!profile || !rating) return <NotFoundScreen />;

	const utils = api.useUtils();
	const form = useForm<{ content: string }>({
		resolver: zodResolver(z.object({ content: z.string() })),
		defaultValues: {
			content: "",
		},
	});

	const { mutate, isPending } = api.comments.create.useMutation({
		onSuccess: async () => {
			form.reset();
			router.back();
			router.navigate({
				pathname: "[handle]/ratings/[id]",
				params: { handle, id: resourceId },
			});
		},
		onSettled: () => {
			utils.comments.list.invalidate({
				authorId: profile.userId,
				resourceId,
			});
			utils.comments.count.rating.invalidate({
				authorId: profile.userId,
				resourceId,
			});
		},
	});

	const onSubmit = async ({ content }: { content: string }) => {
		mutate({
			content,
			resourceId,
			authorId: profile.userId,
		});
	};

	return (
		<ScrollView className="h-full" automaticallyAdjustKeyboardInsets>
			<Stack.Screen
				options={{
					title: `Reply`,
					headerRight: () => (
						<Button
							onPress={form.handleSubmit(onSubmit)}
							disabled={isPending}
							variant="secondary"
							size="sm"
						>
							<Text>Post</Text>
						</Button>
					),
				}}
			/>
			<Review {...rating} profile={profile} hideActions />
			<View className="h-1 bg-muted" />
			<Controller
				control={form.control}
				name="content"
				render={({ field }) => (
					<View className="p-4 flex-1">
						<TextInput
							placeholder="Create a new comment..."
							autoFocus
							multiline
							className="text-lg text-foreground"
							scrollEnabled={false}
							onChangeText={field.onChange}
							{...field}
						/>
					</View>
				)}
			/>
		</ScrollView>
	);
};

export default Reply;
