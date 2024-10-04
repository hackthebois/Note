import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
	schema: "./src/schema.ts",
	dialect: "postgresql",
	out: "./migrations",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
} satisfies Config;
