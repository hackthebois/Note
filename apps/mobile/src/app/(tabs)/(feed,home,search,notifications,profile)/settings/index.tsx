import { WebWrapper } from "@/components/WebWrapper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BellOff } from "@/lib/icons/IconsLoader";
import { BellRing } from "@/lib/icons/IconsLoader";
import { HelpCircle } from "@/lib/icons/IconsLoader";
import { Moon } from "@/lib/icons/IconsLoader";
import { Sun } from "@/lib/icons/IconsLoader";
import { UserMinus } from "@/lib/icons/IconsLoader";
import { UserPen } from "@/lib/icons/IconsLoader";
import { useColorScheme } from "@/lib/useColorScheme";
import { reloadAppAsync } from "expo";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

const SettingsPage = () => {
  const logout = useAuth((s) => s.logout);
  const profile = useAuth((s) => s.profile);
  const { setColorScheme, colorScheme } = useColorScheme();
  const utils = api.useUtils();

  const { data: user } = api.users.me.useQuery();
  const updateUser = api.users.update.useMutation({
    onSuccess: () => {
      utils.users.me.invalidate();
    },
  });

  if (!profile) return <Redirect href="/(auth)/signin" />;

  return (
    <ScrollView>
      <WebWrapper>
        <View className="p-4 gap-4">
          <Stack.Screen
            options={{
              title: "Settings",
            }}
          />
          <Link href={`/settings/editprofile`} asChild>
            <Button
              variant="outline"
              className="gap-2 flex-row justify-between"
            >
              <Text>Edit Profile</Text>
              <UserPen className="text-muted-foreground" size={20} />
            </Button>
          </Link>
          <Link href={"/settings/support"} asChild>
            <Button
              variant="outline"
              className="flex-row items-center gap-2 justify-between"
            >
              <Text>Support</Text>
              <HelpCircle className="text-muted-foreground" size={20} />
            </Button>
          </Link>
          <Button
            variant="outline"
            onPress={async () =>
              setColorScheme(colorScheme === "dark" ? "light" : "dark")
            }
            className="flex-row items-center gap-2 justify-between"
          >
            <View className="flex-row items-center justify-between gap-2 flex-1">
              <Text>Theme</Text>
              {colorScheme === "light" ? (
                <View className="flex-row items-center gap-2">
                  <Text className="text-blue-500">Light</Text>
                  <Sun className="text-blue-500" size={20} />
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Text className="text-purple-500">Dark</Text>
                  <Moon className="text-purple-500" size={20} />
                </View>
              )}
            </View>
          </Button>
          <Button
            variant="outline"
            onPress={async () =>
              updateUser.mutate({
                notificationsEnabled: !user?.notificationsEnabled,
              })
            }
            className="flex-row items-center gap-2 justify-between"
            disabled={
              updateUser.isPending || user?.notificationsEnabled === undefined
            }
          >
            <View className="flex-row items-center justify-between gap-2 flex-1">
              <Text>Push Notifications</Text>
              {user?.notificationsEnabled ? (
                <View className="flex-row items-center gap-2">
                  <Text className="text-green-500">On</Text>
                  <BellRing size={20} className="text-green-500" />
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Text className="text-red-500">Off</Text>
                  <BellOff size={20} className="text-red-500" />
                </View>
              )}
            </View>
          </Button>
          <Link href={`/settings/deleteaccount`} asChild>
            <Button
              variant="outline"
              className="gap-2 flex-row justify-between"
            >
              <Text>Delete Account</Text>
              <UserMinus className="text-destructive" size={20} />
            </Button>
          </Link>
          <Button
            variant="secondary"
            onPress={async () => {
              await logout();
              await reloadAppAsync();
            }}
          >
            <Text>Sign Out</Text>
          </Button>
        </View>
      </WebWrapper>
    </ScrollView>
  );
};

export default SettingsPage;
