import { cn } from "@recordscratch/lib";
import { Button } from "../ui/button";
import { ArtistItem } from "../Item/ArtistItem";
import { Category, ListWithResources, UserListItem } from "@recordscratch/types";
import { ResourceItem } from "../Item/ResourceItem";
import { api } from "@/lib/api";
import { Dimensions, View } from "react-native";
import { Link } from "expo-router";
import { Text } from "@/components/ui/text";
import { DeleteButton } from "./ModifyResource";
import { useAuth } from "@/lib/auth";

export const TopList = ({
	category,
	editMode,
	isUser,
	list,
	setEditMode,
}: {
	category: Category;
	editMode: boolean;
	isUser: boolean;
	list: ListWithResources | undefined;
	setEditMode: (edit: boolean) => void;
}) => {
	const listId = list?.id;
	const resources = list?.resources;
	const utils = api.useUtils();
	const userId = useAuth((s) => s.profile!.userId);
	const windowWidth = Dimensions.get("window").width;
	const top6Width = windowWidth / 4;

	const { mutate: deleteResource } = api.lists.resources.delete.useMutation({
		onSettled: () => {
			utils.lists.topLists.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});
	const { mutate: createList } = api.lists.create.useMutation({
		onSettled: () => {
			utils.lists.topLists.invalidate({ userId });
			utils.lists.getUser.invalidate({ userId });
		},
	});

	let renderItem: (resource: UserListItem) => JSX.Element;
	const resourceOptions = {
		titleCss: "font-medium line-clamp-2 text-center text-base",
		showArtist: false,
		imageWidthAndHeight: top6Width,
		width: top6Width,
	};
	if (category == "ALBUM")
		renderItem = (resource: UserListItem) => (
			<ResourceItem
				resource={{
					parentId: resource.parentId!,
					resourceId: resource.resourceId,
					category: "ALBUM",
				}}
				direction="vertical"
				{...resourceOptions}
			/>
		);
	else if (category == "SONG")
		renderItem = (resource: UserListItem) => (
			<ResourceItem
				resource={{
					parentId: resource.parentId!,
					resourceId: resource.resourceId,
					category: "SONG",
				}}
				direction="vertical"
				{...resourceOptions}
			/>
		);
	else
		renderItem = (resource: UserListItem) => (
			<ArtistItem
				artistId={resource.resourceId}
				direction="vertical"
				textCss="font-medium line-clamp-2 -mt-2 text-center text-base"
				imageWidthAndHeight={top6Width}
			/>
		);

	if (!listId || !resources) {
		return (
			<Link
				href={{
					pathname: "/(modals)/searchResource",
					params: {
						category: category,
						listId: listId,
					},
				}}
				asChild
			>
				{isUser && (
					<Button
						variant={"outline"}
						className={cn("gap-1 rounded-lg", category == "ARTIST" && "rounded-full")}
						style={{ width: top6Width, height: top6Width }}
						onPress={() => {
							createList({
								name: `My Top 6 ${category.toLowerCase()}s`,
								category,
								onProfile: true,
							});

							utils.lists.topLists.invalidate({
								userId,
							});

							utils.lists.getUser.invalidate({ userId });
							setEditMode(false);
						}}
					>
						<Text>Add {category.toLowerCase()}</Text>
					</Button>
				)}
			</Link>
		);
	}

	return (
		<View
			className="flex flex-row flex-wrap gap-5"
			style={{ marginLeft: top6Width / 4, height: top6Width * 3.5 }}
		>
			{resources.map((resource) => (
				<View className="relative mb-1 h-auto overflow-hidden" key={resource.resourceId}>
					{renderItem(resource)}
					<DeleteButton
						isVisible={editMode}
						position={resource.position}
						className="absolute right-0.5 top-0.5"
						onPress={() => {
							deleteResource({
								resourceId: resource.resourceId,
								listId: resource.listId,
							});
							if (resources.length === 1) setEditMode(false);
						}}
					/>
				</View>
			))}

			{resources.length < 6 && isUser && (
				<Link
					href={{
						pathname: "/(modals)/searchResource",
						params: {
							category: category,
							listId: listId,
						},
					}}
					asChild
				>
					<Button
						variant="secondary"
						className={cn(
							"gap-1",
							category === "ARTIST" ? "rounded-full" : "rounded-lg"
						)}
						style={{ width: top6Width, height: top6Width }}
						onPress={() => setEditMode(false)}
					>
						<Text>Add {category.toLowerCase()}</Text>
					</Button>
				</Link>
			)}
		</View>
	);
};
