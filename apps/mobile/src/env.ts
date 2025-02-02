import * as Updates from "expo-updates";
import { Platform } from "react-native";

console.log("PROCESS.ENV", process.env);

let env = {
  ENV: "development",
  R2_PUBLIC_URL: "https://cdn.recordscratch.app",
  SCHEME: Platform.OS === "web" ? "http://localhost:8081/" : "recordscratch://",
  SITE_URL:
    Platform.OS === "android"
      ? "https://humane-cockatoo-instantly.ngrok-free.app"
      : "http://localhost:3000",
  DEBUG: true,
};

if (Updates.channel === "production") {
  env.ENV = "production";
  env.SITE_URL = "https://recordscratch.app";
  env.DEBUG = false;
} else if (Updates.channel === "staging") {
  env.ENV = "staging";
  env.SITE_URL = "https://recordscratch.app"; // No staging site yet
}

export default env;
