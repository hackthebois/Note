"use client";

import { SpotifyAlbum } from "@/types/spotify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlbumImage from "./AlbumImage";

export const AlbumItem = ({
	album,
	song,
	showType,
	onClick,
}: {
	album: SpotifyAlbum;
	song?: string;
	showType?: boolean;
	onClick?: () => void;
}) => {
	const router = useRouter();

	return (
		<Link
			onClick={onClick}
			href={`/albums/${album.id}`}
			className="flex flex-1 flex-row items-center gap-4 rounded"
		>
			<div className="relative h-16 w-16 min-w-[64px] overflow-hidden rounded">
				<AlbumImage album={album} size={64} />
			</div>
			<div className="max-w-full">
				<p className="w-full truncate font-medium">
					{song ? song : album.name}
				</p>
				<div className="flex gap-1">
					{album.artists.map((artist) => (
						<button
							key={artist.id}
							onClick={(e) => {
								e.preventDefault();
								close();
								router.push(`/artists/${artist.id}`);
							}}
							className="truncate py-1 text-sm text-muted-foreground hover:underline"
						>
							{artist.name}
						</button>
					))}
					{showType &&
						(song ? (
							<p className="truncate py-1 text-sm text-muted-foreground">
								• Song
							</p>
						) : (
							<p className="truncate py-1 text-sm text-muted-foreground">
								• Album
							</p>
						))}
				</div>
			</div>
		</Link>
	);
};
