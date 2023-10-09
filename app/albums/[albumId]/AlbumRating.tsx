"use client";

import { trpc } from "@/app/_trpc/react";
import { Rating } from "@/drizzle/db/schema";
import { Resource } from "@/types/ratings";
import { Star } from "lucide-react";

type Props = {
	resource: Resource;
	initialRating?: Rating | null;
};

const AlbumRating = ({ resource, initialRating }: Props) => {
	const { data: rating } = trpc.rating.getAverage.useQuery(resource, {
		initialData: initialRating,
		staleTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return (
		<>
			<Star
				color="orange"
				fill={rating?.ratingAverage ? "orange" : "none"}
				size={30}
			/>
			<div>
				<p className="text-lg font-semibold">
					{rating?.ratingAverage
						? `${rating?.ratingAverage}`
						: "No ratings"}
				</p>
				<p className="text-xs text-muted-foreground">
					{rating?.totalRatings ?? "0"}
				</p>
			</div>
		</>
	);
};

export default AlbumRating;
