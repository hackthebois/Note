import { protectedProcedure, publicProcedure, router } from "@/server/trpc";
import {
	insertListSchema,
	insertListResourcesSchema,
	selectListSchema,
	selectListResourcesSchema,
	deleteListResourcesSchema,
	updateListSchema,
	filterUserListsSchema,
	listOfResourcesSchema,
} from "@/types/list";
import { listResources, lists } from "../db/schema";
import { generateId } from "lucia";
import { and, desc, eq } from "drizzle-orm/sql";

export const listsRouter = router({
	get: publicProcedure
		.input(selectListSchema)
		.query(async ({ ctx: { db }, input: { id } }) => {
			return (
				(await db.query.lists.findFirst({
					where: eq(lists.id, id),
					with: { profile: true },
				})) ?? null
			);
		}),

	getUser: publicProcedure
		.input(filterUserListsSchema)
		.query(async ({ ctx: { db }, input: { userId, category } }) => {
			let whereClause;
			if (category)
				whereClause = and(
					eq(lists.userId, userId),
					eq(lists.category, category)
				);
			else whereClause = and(eq(lists.userId, userId));

			return await db.query.lists.findMany({
				with: {
					resources: {
						limit: 4,
					},
					profile: true,
				},
				where: whereClause,
			});
		}),

	create: protectedProcedure
		.input(insertListSchema)
		.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
			const id = generateId(15);
			await db.insert(lists).values({ id, userId, ...inputs });
		}),

	update: protectedProcedure
		.input(updateListSchema)
		.mutation(
			async ({
				ctx: { db, userId },
				input: { id, name, description },
			}) => {
				const listExists: boolean = !!(await db.query.lists.findFirst({
					where: and(eq(lists.id, id), eq(lists.userId, userId)),
				}));

				if (listExists)
					await db
						.update(lists)
						.set({ name: name, description: description })
						.where(and(eq(lists.id, id), eq(lists.userId, userId)));
				else throw new Error("List Doesn't exist");
			}
		),

	delete: protectedProcedure
		.input(selectListSchema)
		.mutation(async ({ ctx: { db, userId }, input: { id } }) => {
			const listExists: boolean = !!(await db.query.lists.findFirst({
				where: and(eq(lists.id, id), eq(lists.userId, userId)),
			}));

			if (listExists)
				await db
					.delete(lists)
					.where(and(eq(lists.id, id), eq(lists.userId, userId)));
			else throw new Error("List Doesn't exist");
		}),

	resources: router({
		updatePositions: publicProcedure
			.input(listOfResourcesSchema)
			.mutation(async ({ ctx: { db }, input }) => {
				await db.transaction(async () => {
					input.map(async (item, index) => {
						await db
							.update(listResources)
							.set({ position: index + 1 })
							.where(
								eq(listResources.resourceId, item.resourceId)
							);
					});
				});
			}),
		get: publicProcedure
			.input(selectListResourcesSchema)
			.query(async ({ ctx: { db }, input: { listId } }) => {
				return await db
					.select()
					.from(listResources)
					.where(eq(listResources.listId, listId))
					.orderBy(listResources.position);
			}),

		create: protectedProcedure
			.input(insertListResourcesSchema)
			.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
				const listOwner = !!(await db.query.lists.findFirst({
					where: and(
						eq(lists.userId, userId),
						eq(lists.id, inputs.listId)
					),
				}));
				if (listOwner) {
					const lastPosition =
						(
							await db.query.listResources.findFirst({
								where: eq(listResources.listId, inputs.listId),
								orderBy: [desc(listResources.position)],
							})
						)?.position ?? 0;

					await db
						.insert(listResources)
						.values({ ...inputs, position: lastPosition + 1 });
				} else throw new Error("cannot add to list if not owner");
			}),

		delete: protectedProcedure
			.input(deleteListResourcesSchema)
			.mutation(async ({ ctx: { db, userId }, input: inputs }) => {
				const listOwner = !!(await db.query.lists.findFirst({
					where: and(
						eq(lists.userId, userId),
						eq(lists.id, inputs.listId)
					),
				}));
				if (listOwner) {
					await db
						.delete(listResources)
						.where(
							and(
								eq(listResources.listId, inputs.listId),
								eq(listResources.resourceId, inputs.resourceId)
							)
						);
				} else throw new Error("cannot delete from list if not owner");
			}),
	}),
});
