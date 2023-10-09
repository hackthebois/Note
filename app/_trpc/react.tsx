"use client";

import { env } from "@/env.mjs";
import type { AppRouter } from "@/server/_app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
	children: React.ReactNode;
	headers: Headers; // <-- Important
}) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			// transformer,
			links: [
				unstable_httpBatchStreamLink({
					url: `${env.NEXT_PUBLIC_SITE_URL}/api/trpc`,
					headers() {
						const headers = new Map(props.headers);
						return Object.fromEntries(headers);
					},
				}),
			],
		})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</trpc.Provider>
		</QueryClientProvider>
	);
}
