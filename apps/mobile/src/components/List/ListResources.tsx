import { ArtistItem } from "@/components/Item/ArtistItem";
import { ResourceItem } from "@/components/Item/ResourceItem";
import { cn } from "@recordscratch/lib";
import { Category, ListItem } from "@recordscratch/types";
import { View } from "react-native";
import { Text } from "../ui/text";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useState } from "react";
import { AlignJustify } from "@/lib/icons/IconsLoader";

const ListResources = ({ items, category }: { items: ListItem[]; category: Category }) => {
	return (
		<View className="flex flex-col w-full h-full">
			{items.map((item, index) => (
				<AnimatedResource key={index} index={index} item={item} category={category} />
			))}
		</View>
	);
};

const AnimatedResource = ({
	index,
	item,
	category,
}: {
	index: number;
	item: ListItem;
	category: Category;
}) => {
	const [moving, setMoving] = useState(false);
	const top = useSharedValue(item.position);
	const gestureHandler = Gesture.Pan()
		.onStart(() => {
			setMoving(true); // Mark the current item as active
		})
		.onUpdate((event) => {
			const positionY = event.absoluteY;
		})
		.onEnd(() => {
			setMoving(false); // Reset active state on gesture end
		})
		.runOnJS(true);
	const animatedStyle = useAnimatedStyle(() => ({
		left: 5,
		marginRight: 20,
		top: top.value,
		shadowColor: "black",
		zIndex: moving ? 1 : 0,
		shadowOffset: { height: 0, width: 0 },
		shadowOpacity: withSpring(moving ? 1 : 0),
		shadowRadius: moving ? 10 : 0,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: moving ? "white" : "",
		borderRadius: 10,
		width: "80%",
	}));
	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<GestureDetector gesture={gestureHandler}>
				<Animated.View style={animatedStyle}>
					<Animated.Text
						style={{ fontSize: 12, marginLeft: 15 }}
						className="text-muted-foreground font-bold w-6"
					>
						{index + 1}
					</Animated.Text>
					{category === "ARTIST" ? (
						<ArtistItem
							artistId={item.resourceId}
							imageWidthAndHeight={75}
							showLink={false}
						/>
					) : (
						<ResourceItem
							resource={{
								parentId: item.parentId!,
								resourceId: item.resourceId,
								category: category,
							}}
							imageWidthAndHeight={60}
							titleCss="font-medium"
							showArtist={false}
							showLink={false}
							className="min-w-72 min-h-24"
						/>
					)}
				</Animated.View>
			</GestureDetector>
		</View>
	);
};

export default ListResources;
