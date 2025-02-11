import { Pill } from "@/components/ui/pill";
import { Text } from "@/components/ui/text";
import { Genre } from "@recordscratch/lib";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";

const Metadata = ({
	title,
	cover,
	type,
	tags,
	genres,
	children,
	size = "base",
}: {
	title?: string;
	cover?: string | React.ReactNode;
	type?: string;
	tags?: (string | undefined)[];
	genres?: Genre[];
	children: React.ReactNode;
	size?: "base" | "sm";
}) => {
	return (
		<View className="mt-4 flex flex-col gap-4 pb-4 sm:flex-row sm:px-4">
			{typeof cover === "string" ? (
				<View className="self-center overflow-hidden rounded-xl sm:self-start">
					<Image
						alt={`${title} cover`}
						source={cover}
						style={[
							size === "sm"
								? { width: 150, height: 150 }
								: {
										width: 200,
										height: 200,
									},
						]}
					/>
				</View>
			) : (
				<View className={"self-center sm:self-start"}>{cover}</View>
			)}
			<View className="flex flex-col items-center justify-center gap-4 sm:items-start sm:justify-center">
				<View className="flex flex-col items-center justify-center gap-4 px-4 sm:items-start">
					{!!type && (
						<Text className="text-muted-foreground">
							{type.toUpperCase()}
						</Text>
					)}
					{title && (
						<Text variant={"h1"} className="text-center">
							{title}
						</Text>
					)}
					{tags && (
						<View className="flex flex-row flex-wrap justify-center gap-3 sm:justify-start">
							{tags
								.filter((tag) => Boolean(tag))
								.map((tag, index) => (
									<Pill key={index}>{tag}</Pill>
								))}

							{genres &&
								genres
									.filter((genre) => Boolean(genre))
									.map((genre) => (
										<Link
											href={`/genre/${genre.id}`}
											key={genre.id}
										>
											<Pill>{genre.name}</Pill>
										</Link>
									))}
						</View>
					)}
				</View>
				<View className="w-full px-4">{children}</View>
			</View>
		</View>
	);
};

export default Metadata;
