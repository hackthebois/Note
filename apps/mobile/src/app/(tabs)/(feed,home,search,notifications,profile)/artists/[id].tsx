import AlbumItem from "@/components/Item/AlbumItem";
import { ArtistItem } from "@/components/Item/ArtistItem";
import AddToListButton from "@/components/List/AddToListButton";
import Metadata from "@/components/Metadata";
import { RatingInfo } from "@/components/Rating/RatingInfo";
import SongTable from "@/components/SongTable";
import { WebWrapper } from "@/components/WebWrapper";
import { Text } from "@/components/ui/text";
import { getQueryOptions } from "@/lib/deezer";
import { FlashList } from "@shopify/flash-list";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ArtistPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artistId = id!;

  const { data: artist } = useSuspenseQuery(
    getQueryOptions({
      route: "/artist/{id}",
      input: {
        id: artistId,
      },
    }),
  );
  const { data: top } = useSuspenseQuery(
    getQueryOptions({
      route: "/artist/{id}/top",
      input: {
        id: artistId,
      },
    }),
  );
  const { data: albums } = useSuspenseQuery(
    getQueryOptions({
      route: "/artist/{id}/albums",
      input: {
        id: artistId,
        limit: 100,
      },
    }),
  );
  const { data: artists } = useSuspenseQuery(
    getQueryOptions({
      route: "/artist/{id}/related",
      input: {
        id: artistId,
      },
    }),
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <Stack.Screen />
      <View className="flex-1">
        <ScrollView>
          <WebWrapper>
            <View className="flex flex-row justify-center sm:justify-start">
              <Metadata
                title={artist.name}
                cover={artist.picture_big ?? ""}
                type="ARTIST"
              >
                <View className="flex flex-row items-center justify-center gap-3 pb-4">
                  <RatingInfo
                    resource={{
                      resourceId: String(artist.id),
                      category: "ARTIST",
                      parentId: "",
                    }}
                  />

                  <AddToListButton
                    resourceId={String(artist.id)}
                    category="ARTIST"
                  />
                </View>
              </Metadata>
            </View>
            <Text variant="h2" className="pt-6 pb-4 px-4">
              Top Songs
            </Text>
            <SongTable songs={top.data} />
            <View className="pb-4">
              <Text variant="h2" className="pt-6 pb-4 px-4">
                Related Artists
              </Text>
              <FlashList
                data={artists.data}
                renderItem={({ item: artist }) => (
                  <ArtistItem
                    artistId={String(artist.id)}
                    initialArtist={artist}
                    direction="vertical"
                    imageWidthAndHeight={105}
                  />
                )}
                horizontal
                showsHorizontalScrollIndicator={Platform.OS === "web"}
                contentContainerClassName="px-4"
                ItemSeparatorComponent={() => <View className="w-4" />}
                estimatedItemSize={105}
              />
              <Text variant="h2" className="pt-6 pb-4 px-4">
                Discography
              </Text>
              <FlashList
                data={albums.data}
                renderItem={({ item }) => (
                  <AlbumItem resourceId={String(item.id)} />
                )}
                horizontal
                showsHorizontalScrollIndicator={Platform.OS === "web"}
                estimatedItemSize={160}
                contentContainerClassName="px-4"
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            </View>
          </WebWrapper>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ArtistPage;
