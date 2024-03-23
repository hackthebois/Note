import { Button } from "@/components/ui/Button";
import { api } from "@/trpc/react";
import { Suspense } from "react";
import SignedIn from "../SignedIn";
import { Skeleton } from "../ui/Skeleton";

export const FollowButton = ({ profileId }: { profileId: string }) => {
	return (
		<Suspense fallback={<Skeleton className="h-8 w-20" />}>
			<SignedIn>
				<FollowButtonInner profileId={profileId} />
			</SignedIn>
		</Suspense>
	);
};

export const FollowButtonInner = ({ profileId }: { profileId: string }) => {
	const utils = api.useUtils();
	const [profile] = api.profiles.get.useSuspenseQuery(profileId);
	const [isFollowing] = api.profiles.isFollowing.useSuspenseQuery(profileId);

	const revalidate = async () => {
		await utils.profiles.isFollowing.invalidate(profileId);

		// Invalidate profiles followers
		utils.profiles.followCount.invalidate({
			profileId: profileId,
			type: "followers",
		});
		utils.profiles.followProfiles.invalidate({
			profileId,
			type: "followers",
		});

		// Invalidate user following
		utils.profiles.followCount.invalidate({
			profileId: profile!.userId!,
			type: "following",
		});
		utils.profiles.followProfiles.invalidate({
			profileId: profile!.userId!,
			type: "following",
		});
	};

	const { mutate: followUser, isPending: isFollow } =
		api.profiles.follow.useMutation({
			onSettled: async () => {
				await revalidate();
			},
		});
	const { mutate: unFollowUser, isPending: isUnFollow } =
		api.profiles.unFollow.useMutation({
			onSettled: async () => {
				await revalidate();
			},
		});

	const following = isFollow ? true : isUnFollow ? false : isFollowing;

	return (
		<Button
			variant="outline"
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				if (isFollow || isUnFollow) return;
				if (following) unFollowUser(profileId);
				else followUser(profileId);
			}}
		>
			{following ? "Unfollow" : "Follow"}
		</Button>
	);
};
