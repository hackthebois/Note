import { and, eq, sql } from "drizzle-orm";
import { db } from "./config";
import {
	RatingCategory,
	SelectRatingType,
	UserRating,
	ratings,
} from "./schema";

/**********************************
	Rating Database Functions
***********************************/

// Inserts a new album rating
export const insertRating = async (rating: UserRating) => {
	return db.insert(ratings).values(rating);
};

// Updates an existing album rating
export const updateRating = async ({
	resourceId,
	userId,
	rating,
	title,
	description,
}: UserRating) => {
	return db
		.update(ratings)
		.set({
			rating,
			title,
			description,
		})
		.where(
			and(eq(ratings.resourceId, resourceId), eq(ratings.userId, userId))
		);
};

// Gets the users rating
export const getUserRating = async ({
	userId,
	resourceId,
}: Omit<SelectRatingType, "category">) => {
	const rating = await db
		.select()
		.from(ratings)
		.where(
			and(eq(ratings.userId, userId), eq(ratings.resourceId, resourceId))
		);

	if (!rating.length) return null;
	else return rating[0];
};
export type GetUserRating = Awaited<ReturnType<typeof getUserRating>>;

// Gets the users rating
export const userRatingExists = async ({
	resourceId,
	userId,
	category,
}: SelectRatingType) => {
	return (
		(
			await db
				.select({ count: sql<string>`1` })
				.from(ratings)
				.where(
					and(
						eq(ratings.userId, userId),
						eq(ratings.resourceId, resourceId),
						eq(ratings.category, category)
					)
				)
				.limit(1)
		).length != 0
	);
};
export type UserRatingExists = Awaited<ReturnType<typeof userRatingExists>>;

// Gets the total mean average rating for an album
export const getRatingAverage = async (
	resourceId: string,
	category: RatingCategory
) => {
	const average = await db
		.select({
			ratingAverage: sql<number>`ROUND(AVG(rating), 1)`,
			totalRatings: sql<number>`COUNT(*)`,
		})
		.from(ratings)
		.where(
			and(
				eq(ratings.resourceId, resourceId),
				eq(ratings.category, category)
			)
		);

	if (average[0].totalRatings == 0) return null;
	else return average[0];
};
export type GetRatingAverage = Awaited<ReturnType<typeof getRatingAverage>>;

// Deletes the users rating
export const deleteUserRating = async ({
	userId,
	resourceId,
}: Omit<SelectRatingType, "category">) => {
	await db
		.delete(ratings)
		.where(
			and(eq(ratings.userId, userId), eq(ratings.resourceId, resourceId))
		);
};
export type DeleteUserRating = Awaited<ReturnType<typeof deleteUserRating>>;

// Gets all of the users ratings
export const getAllUserRatings = async ({
	userId,
	category,
}: Omit<SelectRatingType, "resourceId">) => {
	const userRatings = await db
		.select()
		.from(ratings)
		.where(and(eq(ratings.userId, userId), eq(ratings.category, category)));

	if (!userRatings.length) return null;
	else return userRatings;
};
export type GetAllUserRatings = Awaited<ReturnType<typeof getAllUserRatings>>;
