import { Follow } from "@/types/follow";
import { Profile } from "@/types/profile";
import { ProfileItem } from "./ProfileItem";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/Dialog";
import { ScrollArea } from "./ui/ScrollArea";

const FollowersPopup = ({
	title,
	followerCount,
	profiles,
}: {
	title: string;
	followerCount: number;
	profiles: (Follow & { profile: Profile & { isFollowing: boolean } })[];
}) => {
	// gets the profiles in each follower
	const profileList = profiles.map(({ profile }, index) => {
		return (
			<div key={index} className="py-1 pr-4">
				<ProfileItem profile={profile} onClick={() => {}} />
			</div>
		);
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="text-md rounded-lg px-4 py-1">{followerCount}</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[20rem] sm:max-w-[24rem]  md:max-w-[28rem] lg:max-w-[28rem]">
				<DialogHeader className="items-center">
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="flex max-h-[20rem] flex-col gap-4 overflow-visible px-2 md:max-h-[24rem]  lg:max-h-[28rem]">
					{profileList}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default FollowersPopup;
