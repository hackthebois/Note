import { likes } from "@recordscratch/db";
import { SelectLikeSchema } from "@recordscratch/types";
import { and, count, eq } from "drizzle-orm";
import { createLikeNotification } from "../notifications";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const likesRouter = router({
	getLikes: publicProcedure
		.input(SelectLikeSchema)
		.query(async ({ ctx: { db }, input: { resourceId, authorId } }) => {
			const countList = await db
				.select({
					count: count(),
				})
				.from(likes)
				.where(and(eq(likes.resourceId, resourceId), eq(likes.authorId, authorId)));
			return countList[0].count;
		}),
	like: protectedProcedure
		.input(SelectLikeSchema)
		.mutation(async ({ ctx: { db, userId }, input: { authorId, resourceId } }) => {
			await db.insert(likes).values({
				userId,
				authorId,
				resourceId,
			});
			// TODO: Only send notifications if the user is not the author
			if (true) {
				await createLikeNotification({
					resourceId,
					fromId: userId,
					userId: authorId,
				});
			}
		}),
	unlike: protectedProcedure
		.input(SelectLikeSchema)
		.mutation(async ({ ctx: { db, userId }, input: { resourceId, authorId } }) => {
			await db
				.delete(likes)
				.where(
					and(
						eq(likes.userId, userId),
						eq(likes.resourceId, resourceId),
						eq(likes.authorId, authorId)
					)
				);
		}),
	get: protectedProcedure
		.input(SelectLikeSchema)
		.query(async ({ ctx: { db, userId }, input: { resourceId, authorId } }) => {
			const like = await db.query.likes.findFirst({
				where: and(
					eq(likes.userId, userId),
					eq(likes.resourceId, resourceId),
					eq(likes.authorId, authorId)
				),
			});
			return like ? like : null;
		}),
});
