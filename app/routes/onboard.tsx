import { Head } from "@/components/Head";
import { UserAvatar } from "@/components/UserAvatar";
import { ErrorComponent } from "@/components/router/ErrorComponent";
import { PendingComponent } from "@/components/router/Pending";
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
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/trpc/react";
import type { Onboard } from "@/types/profile";
import { OnboardSchema, handleRegex } from "@/types/profile";
import { useDebounce } from "@/utils/hooks";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AtSign, Disc3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/onboard")({
	component: Onboard,
	pendingComponent: PendingComponent,
	errorComponent: ErrorComponent,
});

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
				"flex-col items-center p-4",
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

function Onboard() {
	const utils = api.useUtils();
	const [page, setPage] = useState(0);
	const navigate = useNavigate();
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const form = useForm<Onboard>({
		resolver: zodResolver(OnboardSchema),
		mode: "onChange",
		defaultValues: {
			handle: "",
			name: "",
			bio: "",
			image: undefined,
		},
	});
	const { name, image, handle, bio } = form.watch();
	const imageRef = useRef<HTMLInputElement>(null);
	const { data: profile, isSuccess } = api.profiles.me.useQuery();

	useEffect(() => {
		if (profile !== null && isSuccess) {
			navigate({
				to: "/",
			});
		}
	}, [profile, isSuccess, navigate]);

	const { mutate: createProfile } = api.profiles.create.useMutation({
		onSuccess: () => {
			utils.profiles.me.invalidate();
			navigate({
				to: "/",
			});
		},
	});
	const { mutateAsync: getSignedURL } =
		api.profiles.getSignedURL.useMutation();

	const debouncedHandle = useDebounce(handle, 500);
	const { data: handleExists } = api.profiles.handleExists.useQuery(
		debouncedHandle,
		{
			enabled: debouncedHandle.length > 0,
		}
	);
	useEffect(() => {
		if (handleExists) {
			form.setError("handle", {
				type: "validate",
				message: "Handle already exists",
			});
		} else {
			if (
				form.formState.errors.handle?.message ===
				"Handle already exists"
			) {
				form.clearErrors("handle");
			}
		}
	}, [handleExists]);

	const onSubmit = async ({ name, handle, image, bio }: Onboard) => {
		let imageUrl: string | null = null;
		if (image) {
			const url = await getSignedURL({
				type: image.type,
				size: image.size,
			});

			await fetch(url, {
				method: "PUT",
				body: image,
				headers: {
					"Content-Type": image?.type,
				},
			});

			imageUrl = url.split("?")[0];
		}

		createProfile({
			name,
			handle,
			imageUrl,
			bio: bio ?? null,
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
		} else if (pageIndex === 2) {
			return true;
		} else if (pageIndex === 3) {
			return true;
		} else {
			return false;
		}
	};

	if (form.formState.isSubmitting || form.formState.isSubmitSuccessful) {
		return (
			<main className="mx-auto flex min-h-[100svh] w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 sm:p-6">
				<Disc3 size={50} className="animate-spin" />
			</main>
		);
	}

	return (
		<main className="mx-auto flex min-h-[100svh] w-full max-w-screen-lg flex-1 flex-col items-center justify-center p-4 sm:p-6">
			<Head title="Onboard" />
			<Form {...form}>
				<form>
					<SlideWrapper page={page} pageIndex={0}>
						<Disc3 size={200} className="animate-spin" />
						<h1 className="mt-12 text-center">
							Welcome to RecordScratch!
						</h1>
						<p className="mt-6 text-center text-muted-foreground">
							Before you get started we have to set up your
							profile.
						</p>
						<p className="mt-3 text-center text-muted-foreground">
							Press next below to get started.
						</p>
					</SlideWrapper>
					<SlideWrapper page={page} pageIndex={1}>
						<Tag variant="outline">STEP 1/3</Tag>
						<h1 className="mt-6">Pick a name</h1>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Input
											{...field}
											placeholder="Name"
											className="mt-8 w-full"
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
								<FormItem className="w-full">
									<FormControl>
										<div className="relative mt-4 flex w-full items-center">
											<AtSign
												className="absolute left-3 text-muted-foreground"
												size={15}
											/>
											<Input
												{...field}
												placeholder="Handle"
												className="w-full pl-[30px]"
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
						<Tag variant="outline">STEP 2/3</Tag>
						<h1 className="mt-6">Describe yourself</h1>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Bio"
											className="mt-8 w-80"
											autoComplete="off"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</SlideWrapper>
					<SlideWrapper page={page} pageIndex={3}>
						<Tag variant="outline">STEP 2/3</Tag>
						<h1 className="mt-4">Image</h1>
						<UserAvatar
							className="mt-8"
							size={160}
							imageUrl={imageUrl ?? null}
						/>
						<Input
							className="hidden"
							id="image"
							ref={imageRef}
							type="file"
							accept="image/*"
							onChange={(e) => {
								if (e.target.files) {
									form.setValue("image", e.target.files[0], {
										shouldDirty: true,
										shouldValidate: true,
									});
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
									form.clearErrors("image");
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
						<FormMessage>
							{form.formState.errors.image?.message}
						</FormMessage>
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
						if (page === 3) {
							form.handleSubmit(onSubmit)();
						} else {
							setPage((page) => page + 1);
						}
					}}
					disabled={!pageValid(page)}
					variant="secondary"
				>
					{page === 2 && !bio
						? "Skip"
						: page === 3 && !image
							? "Skip"
							: page === 3
								? "Finish"
								: "Next"}
				</Button>
			</div>
		</main>
	);
}
