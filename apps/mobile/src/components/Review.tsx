import { api } from "#/utils/api";
import { ReviewType, SelectComment, SelectLike } from "@recordscratch/types";
import { getImageUrl } from "#/utils/image";
import { cn, timeAgo } from "@recordscratch/lib";
import { Link } from "expo-router";
import { View } from "react-native";
import { Button, buttonVariants } from "#/components/CoreComponents/Button";
import { ResourceItem } from "#/components/Item/ResourceItem";
import { Text } from "#/components/CoreComponents/Text";
import { UserAvatar } from "#/components/UserAvatar";
import { AntDesign } from "@expo/vector-icons";
import { Suspense } from "react";

const IconSize = 30;

const LikeButton = (props: SelectLike) => {
	const utils = api.useUtils();
	const [likes] = api.likes.getLikes.useSuspenseQuery(props);
	const [like] = api.likes.get.useSuspenseQuery(props);

	const { mutate: likeMutation, isPending: isLiking } = api.likes.like.useMutation({
		onSettled: async () => {
			await utils.likes.get.invalidate(props);
			await utils.likes.getLikes.invalidate(props);
		},
	});

	const { mutate: unlikeMutation, isPending: isUnLiking } = api.likes.unlike.useMutation({
		onSettled: async () => {
			await utils.likes.get.invalidate(props);
			await utils.likes.getLikes.invalidate(props);
		},
	});

	const liked = isLiking ? true : isUnLiking ? false : like;
	const likesCount = isLiking ? likes + 1 : isUnLiking ? likes - 1 : likes;

	return (
		<Button
			className=" text-muted-foreground"
			variant="secondary"
			size="auto"
			onPress={() => {
				if (isLiking || isUnLiking) return;
				if (like) {
					unlikeMutation(props);
				} else {
					likeMutation(props);
				}
			}}
		>
			<View className="flex flex-row gap-2 text-muted-foreground items-center p-1">
				{liked ? (
					<AntDesign name="heart" size={IconSize} color="#ff4d4f" />
				) : (
					<AntDesign name="hearto" size={IconSize} color="black" />
				)}

				<Text className="font-bold">{likesCount}</Text>
			</View>
		</Button>
	);
};

const ReplyButton = ({
	handle,
	resourceId,
	onClick,
}: {
	resourceId: string;
	handle: string;
	onClick: () => void;
}) => {
	return (
		<Link
			className={buttonVariants({
				variant: "secondary",
				size: "auto",
				className: "text-muted-foreground p-1",
			})}
			href={{
				pathname: "[handle]/ratings/[id]",
				params: {
					handle,
					id: resourceId,
				},
			}}
			onPress={onClick}
		>
			<AntDesign name="back" size={IconSize} color="black" />
		</Link>
	);
};

const CommentsButton = ({
	handle,
	resourceId,
	authorId,
}: SelectComment & {
	handle: string;
}) => {
	const [comments] = api.comments.getComments.useSuspenseQuery({
		resourceId,
		authorId,
	});

	return (
		<Link
			className={cn(
				buttonVariants({
					variant: "secondary",
					size: "auto",
				})
			)}
			href={{
				pathname: "[handle]/ratings/[id]",
				params: { handle: handle, id: resourceId },
			}}
		>
			<View className="flex flex-row gap-2 text-muted-foreground items-center p-1">
				<AntDesign name="message1" size={IconSize} color="black" />
				<Text className="font-bold">{comments}</Text>
			</View>
		</Link>
	);
};

export const Review = ({
	userId,
	parentId,
	rating,
	profile,
	content,
	resourceId,
	category,
	updatedAt,
	onReply,
}: ReviewType & { onReply?: () => void }) => {
	return (
		<View className="flex flex-col gap-4 rounded-lg border border-gray-300 p-3 py-4 text-card-foreground">
			<ResourceItem
				resource={{ parentId, resourceId, category }}
				showType
				imageWidthAndHeight={80}
				titleCss=""
			/>

			<View className="flex flex-col items-start gap-3">
				<View className="flex flex-row items-center gap-1">
					{Array.from(Array(rating)).map((_, i) => (
						<AntDesign name="star" key={i} size={24} color="#ffb703" />
					))}
					{Array.from(Array(10 - rating)).map((_, i) => (
						<AntDesign name="staro" key={i} size={24} color="#ffb703" />
					))}
				</View>
				<Link href={`/${String(profile.handle)}`}>
					<View className="flex flex-row flex-wrap items-center gap-2">
						<UserAvatar size={65} imageUrl={getImageUrl(profile)} />
						<Text className="text-lg">{profile.name}</Text>
						<Text className="text-left text-muted-foreground text-lg">
							@{profile.handle} • {timeAgo(updatedAt)}
						</Text>
					</View>
				</Link>
				{!!content && (
					<Text className="whitespace-pre-line text-lg min-h-7">{content}</Text>
				)}
				<View className="flex flex-row items-center gap-3">
					<Suspense
						fallback={
							<Button
								variant="secondary"
								size="auto"
								className="gap-2 text-muted-foreground"
							>
								<AntDesign name="hearto" size={IconSize} color="black" />
							</Button>
						}
					>
						<LikeButton resourceId={resourceId} authorId={userId} />
					</Suspense>
					<Suspense
						fallback={
							<Button
								variant="secondary"
								size="auto"
								className="gap-2 text-muted-foreground"
							>
								<AntDesign name="message1" size={IconSize} color="black" />
							</Button>
						}
					>
						<CommentsButton
							handle={profile.handle}
							resourceId={resourceId}
							authorId={userId}
						/>
					</Suspense>
					<ReplyButton
						handle={profile.handle}
						resourceId={resourceId}
						onClick={() => {
							if (onReply) onReply();
						}}
					/>
				</View>
			</View>
		</View>
	);
};
