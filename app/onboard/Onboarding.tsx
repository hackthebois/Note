"use client";

import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/Button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { ProfileSchema, handleRegex } from "@/types/profile";
import { cn } from "@/utils/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Disc3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createProfile } from "../actions";

const SlideWrapper = ({
	page,
	pageIndex,
	children,
}: {
	page: number;
	pageIndex: number;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"flex-col items-center",
				page === pageIndex
					? "duration-1000 animate-in fade-in"
					: "duration-1000 animate-out fade-out",
				page === pageIndex ? "flex" : "hidden"
			)}
		>
			{children}
		</div>
	);
};

export const OnboardSchema = ProfileSchema.pick({
	name: true,
	handle: true,
}).extend({
	image: z.custom<File>((v) => v instanceof File).optional(),
});
export type Onboard = z.infer<typeof OnboardSchema>;

export const Onboarding = () => {
	const [page, setPage] = useState(0);
	const { user } = useUser();
	const router = useRouter();
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const form = useForm<Onboard>({
		resolver: zodResolver(OnboardSchema),
		mode: "onChange",
		defaultValues: {
			handle: "",
			name: "",
			image: undefined,
		},
	});
	const name = form.watch("name");
	const image = form.watch("image");
	const imageRef = useRef<HTMLInputElement>(null);
	const handle = form.watch("handle");

	const onSubmit = async ({ name, handle, image }: Onboard) => {
		let imageUrl: string | null = null;
		if (image) {
			const profileImage = await user?.setProfileImage({
				file: image,
			});
			imageUrl = profileImage?.publicUrl ?? null;
		}

		await createProfile({
			name,
			handle,
			imageUrl,
		});
	};

	useEffect(() => {
		if (!form.getFieldState("handle").isTouched) {
			form.setValue(
				"handle",
				name
					.replace(new RegExp(`[^${handleRegex.source}]+`, "g"), "")
					.replace(" ", "")
			);
		}
	}, [name]);

	useEffect(() => {
		if (page === 1) {
			form.setFocus("name");
		}
	}, [page]);

	useEffect(() => {
		if (image && image instanceof File) {
			setImageUrl(URL.createObjectURL(image));
		}
	}, [image]);

	const pageValid = (pageIndex: number) => {
		if (pageIndex === 0) {
			return true;
		}
		if (pageIndex === 1) {
			return (
				!form.getFieldState("name").invalid &&
				name.length > 0 &&
				!form.getFieldState("handle").invalid &&
				handle.length > 0
			);
		}
		if (pageIndex === 2) {
			return true;
		}
		return false;
	};

	if (form.formState.isSubmitting) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<Disc3 size={50} className="animate-spin" />
			</div>
		);
	}

	return (
		<>
			<Form {...form}>
				<form>
					<SlideWrapper page={page} pageIndex={0}>
						<Disc3 size={200} />
						<h1 className="mt-12">Welcome to RecordScratch!</h1>
						<p className="mt-6 text-muted-foreground">
							Before you get started we have to set up your
							profile.
						</p>
						<p className="mt-3 text-muted-foreground">
							Press next below to get started.
						</p>
					</SlideWrapper>
					<SlideWrapper page={page} pageIndex={1}>
						<Tag>STEP 1/2</Tag>
						<h1 className="mt-6">Pick a name</h1>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											{...field}
											placeholder="Name"
											className="mt-8 w-80"
											autoComplete="off"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="handle"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="relative mt-4 flex w-80 items-center">
											<AtSign
												className="absolute left-3 text-muted-foreground"
												size={16}
											/>
											<Input
												{...field}
												placeholder="handle"
												className="pl-9"
												autoComplete="off"
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SlideWrapper>
					<SlideWrapper page={page} pageIndex={2}>
						<p className="text-sm tracking-widest text-muted-foreground">
							STEP 2/2
						</p>
						<h1 className="mt-4">Image</h1>
						<UserAvatar
							className="mt-8"
							size={160}
							name={name}
							imageUrl={imageUrl ?? null}
							handle={handle}
						/>
						<Input
							className="hidden"
							id="image"
							ref={imageRef}
							type="file"
							onChange={(e) => {
								if (e.target.files) {
									form.setValue("image", e.target.files[0]);
								}
							}}
						/>
						{image ? (
							<Button
								variant="outline"
								className="mt-4"
								onClick={(e) => {
									e.preventDefault();
									form.setValue("image", undefined);
									setImageUrl(undefined);
								}}
							>
								Clear Image
							</Button>
						) : (
							<Button
								variant="ghost"
								className="mt-4"
								onClick={(e) => {
									e.preventDefault();
									imageRef.current?.click();
								}}
							>
								Add Profile Image
							</Button>
						)}
					</SlideWrapper>
				</form>
			</Form>
			<div className="mt-8 flex gap-4">
				{page !== 0 && (
					<Button
						variant="outline"
						onClick={() => setPage((page) => page - 1)}
					>
						Back
					</Button>
				)}
				<Button
					onClick={() => {
						if (page === 2) {
							form.handleSubmit(onSubmit)();
						} else {
							setPage((page) => page + 1);
						}
					}}
					disabled={!pageValid(page)}
					variant="secondary"
				>
					{page === 2 ? (!image ? "Skip" : "Finish") : "Next"}
				</Button>
			</div>
		</>
	);
};
