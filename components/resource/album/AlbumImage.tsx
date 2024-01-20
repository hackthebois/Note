import { Album, SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
import Image from "next/image";

const AlbumImage = ({
	album,
	size,
}: {
	album: SimplifiedAlbum | Album;
	size: number;
}) => {
	return (
		<div className="overflow-hidden rounded-md">
			<Image
				src={album.images[0].url}
				alt={`${album.name} cover`}
				width={size}
				height={size}
				className="aspect-square h-auto w-auto overflow-hidden rounded-md object-cover transition-all hover:scale-105"
			/>
		</div>
	);
};

export default AlbumImage;
