import { zodResolver } from "@hookform/resolvers/zod";
import { RateForm, RateFormSchema, Resource } from "@recordscratch/types";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/lib/api";
import { useAuth } from "~/lib/auth";
import { Star } from "~/lib/icons/Star";

const RatingInput = ({
	value: rating,
	onChange,
}: {
	value: number | null;
	onChange: (_rating: number | null) => void;
}) => {
	return (
		<View className="flex justify-between flex-row">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
				<Pressable
					key={index}
					onPress={() => onChange(index)}
					className="flex flex-row items-center justify-center pt-2"
				>
					<View className="flex flex-col items-center">
						{rating ? (
							index <= rating ? (
								<Star size={28} color="#ffb703" fill="#ffb703" />
							) : (
								<Star size={28} color="#ffb703" />
							)
						) : (
							<Star size={28} color="#ffb703" />
						)}
						<Text className=" text-muted-foreground">{index}</Text>
					</View>
				</Pressable>
			))}
		</View>
	);
};

const RatingModal = () => {
	const router = useRouter();
	const { imageUrl, name, ...resource } = useLocalSearchParams<{
		parentId: Resource["parentId"];
		resourceId: Resource["resourceId"];
		category: Resource["category"];
		imageUrl?: string;
		name?: string;
	}>();
	const utils = api.useUtils();
	const userId = useAuth((s) => s.profile!.userId);

	const { data: userRating } = api.ratings.user.get.useQuery(
		{ resourceId: resource.resourceId, userId },
		{
			staleTime: Infinity,
		}
	);

	const { control, handleSubmit, formState } = useForm<RateForm>({
		resolver: zodResolver(RateFormSchema),
		defaultValues: { ...resource, ...userRating },
	});

	const { mutate: rateMutation } = api.ratings.rate.useMutation({
		onSuccess: async () => {
			await utils.ratings.user.get.invalidate({
				resourceId: resource.resourceId,
				userId,
			});
			await utils.ratings.get.invalidate({
				resourceId: resource.resourceId,
				category: resource.category,
			});
			await utils.profiles.distribution.invalidate({
				userId,
			});
			await utils.ratings.feed.invalidate({
				filters: {
					profileId: userId,
				},
			});
			router.back();
		},
	});

	const onSubmit = async (rate: RateForm) => {
		rateMutation(rate);
	};

	const clearRating = () => {
		if (!userRating) return;
		rateMutation({
			...resource,
			content: null,
			rating: null,
		});
	};

	return (
		<SafeAreaView edges={["bottom"]} className="h-full">
			<ScrollView
				contentContainerClassName="p-4 justify-between"
				automaticallyAdjustKeyboardInsets
				keyboardShouldPersistTaps="handled"
			>
				{imageUrl ? (
					<Image
						alt={`cover`}
						source={{
							uri: imageUrl,
						}}
						style={[
							{
								alignSelf: "center",
								borderRadius: 12,
								width: 200,
								height: 200,
							},
						]}
					/>
				) : null}
				<View className="gap-4 mt-4">
					<Text variant="h1" className="text-center">
						{name}
					</Text>
					<Text className="text-center text-xl">
						{resource.category === "ALBUM"
							? "How would you rate this album?"
							: "How would you rate this song?"}
					</Text>
					<Controller
						control={control}
						name="rating"
						render={({ field: { onChange, value } }) => (
							<RatingInput value={value ?? 0} onChange={onChange} />
						)}
					/>
					<Controller
						control={control}
						name="content"
						render={({ field: { onChange, value } }) => (
							<TextInput
								onChangeText={onChange}
								value={value ?? undefined}
								className="text-lg text-foreground border border-border rounded-xl min-h-32 p-4"
								placeholder="Add review..."
								multiline
							/>
						)}
					/>
				</View>
				<View className="mt-4">
					<Button
						onPress={handleSubmit(onSubmit)}
						disabled={!formState.isValid}
						className="mb-4"
						variant="secondary"
					>
						<Text>Rate</Text>
					</Button>
					{userRating &&
						(userRating.content ? (
							<Pressable
								className="flex items-center"
								onPress={() =>
									Alert.alert(
										"Remove your review?",
										"This will remove your current review",
										[
											{
												text: "Cancel",
												style: "cancel",
											},
											{
												text: "Remove",
												onPress: () => clearRating(),
											},
										]
									)
								}
							>
								<Text>Remove rating</Text>
							</Pressable>
						) : (
							<Pressable onPress={clearRating} className="flex items-center">
								<Text>Remove rating</Text>
							</Pressable>
						))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default RatingModal;
