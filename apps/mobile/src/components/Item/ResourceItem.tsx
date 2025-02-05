import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { getQueryOptions } from "@/lib/deezer";
import { Album, cn } from "@recordscratch/lib";
import { Resource } from "@recordscratch/types";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import ReLink from "../ReLink";

export const ResourceItemSkeleton = ({
  direction = "horizontal",
  imageCss,
  imageWidthAndHeight = 150,
  showArtist = true,
}: {
  direction?: "horizontal" | "vertical";
  imageCss?: string;
  imageWidthAndHeight?: number;
  showArtist?: boolean;
}) => {
  return (
    <View
      className={cn(
        "flex gap-4",
        direction === "vertical" ? "flex-col" : "flex-row items-center",
      )}
      style={{
        width: direction === "vertical" ? imageWidthAndHeight : "100%",
      }}
    >
      <View
        style={{
          width: imageWidthAndHeight,
          height: imageWidthAndHeight,
        }}
      >
        <Skeleton className={cn(`h-full w-full rounded-xl`, imageCss)} />
      </View>
      <View className="flex flex-col gap-2 flex-1">
        <Skeleton className="w-[80%]">
          <Text />
        </Skeleton>
        {showArtist ? (
          <Skeleton className="w-[60%]">
            <Text />
          </Skeleton>
        ) : null}
      </View>
    </View>
  );
};

export const ResourceItem = ({
  initialAlbum,
  resource,
  showType,
  onPress,
  showLink = true,
  direction = "horizontal",
  imageCss,
  titleCss,
  showArtist = true,
  className,
  imageWidthAndHeight = 150,
  artistNameCss,
  style,
}: {
  initialAlbum?: Album;
  resource: Resource;
  showType?: boolean;
  onPress?: () => void;
  showLink?: boolean;
  direction?: "horizontal" | "vertical";
  imageCss?: string;
  imageWidthAndHeight?: number;
  titleCss?: string;
  artistNameCss?: string;
  showArtist?: boolean;
  className?: string;
  width?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const albumId =
    resource.category === "SONG" ? resource.parentId : resource.resourceId;

  const { data: album, isLoading } = useQuery({
    ...getQueryOptions({
      route: "/album/{id}",
      input: {
        id: albumId,
      },
    }),
    initialData: initialAlbum,
  });

  const { data: tracks, isLoading: isLoadingTracks } = useQuery({
    ...getQueryOptions({
      route: "/album/{id}/tracks",
      input: {
        id: albumId,
        limit: 1000,
      },
    }),
    enabled: resource.category === "SONG",
  });

  if (
    isLoading ||
    !album ||
    (resource.category === "SONG" && isLoadingTracks)
  ) {
    return (
      <ResourceItemSkeleton
        {...{ direction, imageCss, imageWidthAndHeight, showArtist }}
      />
    );
  }

  const name =
    resource.category === "SONG"
      ? tracks?.data.find((track) => track.id === Number(resource.resourceId))
          ?.title
      : album?.title;
  return (
    <ReLink
      disabled={!showLink}
      href={
        resource.category === "SONG"
          ? `/albums/${resource.parentId}/songs/${resource.resourceId}`
          : `/albums/${resource.resourceId}`
      }
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
    >
      <View
        className={cn(
          "flex gap-4",
          className,
          direction === "vertical"
            ? "flex-col items-start"
            : "flex-row items-center",
        )}
        style={style}
      >
        <View
          className="overflow-hidden rounded-xl w-full"
          style={{
            width: imageWidthAndHeight,
            height: imageWidthAndHeight,
          }}
        >
          {album.cover_big ? (
            <Image
              source={album.cover_big}
              style={{
                width: imageWidthAndHeight,
                height: imageWidthAndHeight,
              }}
              className={cn(
                "aspect-square h-auto w-auto rounded-xl overflow-hidden transition-all hover:scale-105",
                imageCss,
              )}
            />
          ) : (
            <View className="h-full w-full bg-muted"></View>
          )}
        </View>
        <View
          className={cn(
            "flex flex-col gap-2 overflow-hidden",
            direction === "horizontal" ? "flex-1" : "",
          )}
        >
          <Text
            className={cn("font-semibold mr-3 text-ellipsis", titleCss)}
            numberOfLines={direction === "horizontal" ? 2 : 1}
            style={{ flexWrap: "wrap" }}
          >
            {name}
          </Text>
          <View className="flex flex-row gap-1 self-baseline">
            {showType && (
              <Text className="text-muted-foreground">
                {resource.category === "SONG" ? "Song" : "Album"}
              </Text>
            )}
            {showArtist ? (
              <Text className={cn("text-muted-foreground", artistNameCss)}>
                {showType ? "• " : ""}
                {album.artist?.name}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </ReLink>
  );
};
