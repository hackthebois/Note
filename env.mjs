import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		SPOTIFY_CLIENT: z.string().min(1),
		SPOTIFY_SECRET: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		UPSTASH_REDIS_REST_URL: z.string().min(1),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),
		NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
		NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
		NEXT_PUBLIC_GITHUB_URL: z.string().min(1),
		NEXT_PUBLIC_DISCORD_URL: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL:
			process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
			process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
			process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		NEXT_PUBLIC_GITHUB_URL: process.env.NEXT_PUBLIC_GITHUB_URL,
		NEXT_PUBLIC_DISCORD_URL: process.env.NEXT_PUBLIC_DISCORD_URL,
	},
});
