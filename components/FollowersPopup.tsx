"use client";

import { Follow } from "@/types/follow";
import { Profile } from "@/types/profile";
import { ProfileItem } from "./ProfileItem";
import { Button } from "./ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/Dialog";
import { ScrollArea } from "./ui/ScrollArea";

type Props = {
	title: string;
	followerCount: number;
	profiles: (Follow & { profile: Profile & { isFollowing: boolean } })[];
	userId: string | null;
};

const FollowersPopup = ({ title, followerCount, profiles, userId }: Props) => {
	// gets the profiles in each follower
	const profileList = profiles.map(({ profile }, index) => {
		return (
			<div key={index} className="py-1">
				<ProfileItem
					profile={profile}
					onClick={() => {}}
					initialIsFollowing={profile.isFollowing}
					userId={userId}
				/>
			</div>
		);
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="text-md rounded-lg px-3 py-1">
					{followerCount}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[20rem] md:max-w-[26rem] lg:max-w-[26rem]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="flex max-h-[20rem] flex-col gap-4 overflow-visible px-4 md:max-h-[25rem] lg:max-h-[30rem]">
					{profileList}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
