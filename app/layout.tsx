import { RatingDialogProvider } from "@/components/ratings";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Disc3 } from "lucide-react";
import { Montserrat } from "next/font/google";
import { headers } from "next/headers";
import Link from "next/link";
import { Providers } from "./Providers";
import SearchBar from "./SearchBar";
import SignInButton from "./SignInButton";
import { TRPCReactProvider } from "./_trpc/react";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export const metadata = {
	title: "Treble",
	description: "Music rating and review app",
};

type Props = {
	children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
	return (
		<html lang="en">
			<body
				className={`${montserrat.className} flex h-[100svh] flex-col`}
			>
				<ClerkProvider>
					<TRPCReactProvider headers={headers()}>
						<Providers>
							<header className="border-elevation-4 bg-elevation-1 flex h-14 w-full items-center justify-center border-b">
								<nav className="flex w-full max-w-screen-lg items-center justify-between gap-3 p-4 sm:p-8">
									<div className="flex items-center gap-3">
										<Link
											href="/"
											className="flex items-center gap-3"
										>
											<Button
												size="icon"
												variant="outline"
											>
												<Disc3 size={22} />
											</Button>
										</Link>
										<SearchBar />
									</div>
									<div className="flex items-center justify-center gap-3">
										<SignedIn>
											<UserButton afterSignOutUrl="/" />
										</SignedIn>
										<SignedOut>
											<SignInButton />
										</SignedOut>
										<ThemeToggle />
									</div>
								</nav>
							</header>
							<ScrollArea className="flex h-full w-screen flex-1">
								<main className="mx-auto w-screen max-w-screen-lg p-4 sm:p-8">
									{children}
								</main>
							</ScrollArea>
							<RatingDialogProvider />
						</Providers>
					</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
};

export default RootLayout;
