import { Profile, ProfileSchema, UserSchema } from "@recordscratch/types";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useRef } from "react";
import SuperJSON from "superjson";
import { z } from "zod";
import { createStore, useStore } from "zustand";
import env from "~/env";

// Define the context type
type Auth = {
	status: "loading" | "authenticated" | "unauthenticated" | "needsonboarding";
	sessionId: string | null;
	profile: Profile | null;
	logout: () => Promise<void>;
	login: (session?: string) => Promise<void>;
	setSessionId: (sessionId: string) => Promise<void>;
	setProfile: (profile: Profile) => void;
};

type AuthStore = ReturnType<typeof createAuthStore>;

export const createAuthStore = () =>
	createStore<Auth>()((set, get) => ({
		status: "loading",
		sessionId: null,
		setSessionId: async (sessionId) => {
			await SecureStore.setItemAsync("sessionId", sessionId);
			set({ sessionId });
		},
		profile: null,
		setProfile: (profile) => set({ profile }),
		logout: async () => {
			await fetch(env.SITE_URL + "/api/auth/signout", {
				headers: {
					Authorization: `${get().sessionId}`,
				},
			});
			set({ sessionId: null, profile: null, status: "unauthenticated" });
			await SecureStore.deleteItemAsync("sessionId");
		},
		login: async (session?: string) => {
			const oldSessionId = session ?? (await SecureStore.getItemAsync("sessionId"));
			console.log("oldSessionId", oldSessionId);

			if (!oldSessionId) {
				set({ status: "unauthenticated" });
				return;
			}

			const res = await fetch(`${env.SITE_URL}/api/auth/me?sessionId=${oldSessionId}`);
			const data = await res.json();
			const parsedData = z
				.object({
					user: UserSchema.extend({ profile: ProfileSchema.nullish() }).nullable(),
				})
				.safeParse(
					SuperJSON.deserialize({
						json: data,
						meta: {
							values: {
								"user.profile.createdAt": ["Date"],
								"user.profile.updatedAt": ["Date"],
							},
						},
					})
				);

			if (parsedData.error || !parsedData.data.user) {
				get().logout();
			} else {
				get().setSessionId(oldSessionId);
				if (parsedData.data.user.profile) {
					get().setProfile(parsedData.data.user.profile);
					set({ status: "authenticated" });
				} else {
					set({ status: "needsonboarding" });
				}
			}
		},
	}));

export const AuthContext = createContext<AuthStore | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const store = useRef(createAuthStore()).current;
	const login = useStore(store, (s) => s.login);
	const status = useStore(store, (s) => s.status);
	const sessionId = useStore(store, (s) => s.sessionId);

	useEffect(() => {
		login();
	}, [login]);

	useEffect(() => {
		console.log("AuthContext.Provider", sessionId, status);
	}, [sessionId, status]);

	if (status === "loading") {
		return null;
	}

	return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export function useAuth<T>(selector: (state: Auth) => T): T {
	const store = useContext(AuthContext);
	if (!store) throw new Error("Missing AuthContext.Provider in the tree");
	return useStore(store, selector);
}
