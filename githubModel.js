import db from "./db.js";

/**
 * Save or update a GitHub profile.
 * Performs a parameterized SQLite upsert.
 */
export async function upsertProfile(profileData) {
  const now = new Date().toISOString();
  const dataToSave = {
    ...profileData,
    updated_at: now
  };
  
  // Check if it's an insert or update to manually handle created_at for SQLite if needed,
  // or use onConflict().merge() which Knex maps to INSERT ... ON CONFLICT DO UPDATE
  return await db("github_profiles")
    .insert({
      ...dataToSave,
      created_at: now
    })
    .onConflict("username")
    .merge([
      "name",
      "avatar_url",
      "public_repos",
      "followers",
      "following",
      "public_gists",
      "account_age_years",
      "popularity_score",
      "followers_per_repo",
      "repo_per_follower",
      "updated_at"
    ]);
}

/**
 * Get all analyzed profiles with search, sort, pagination
 */
export async function getAllProfiles({ page = 1, limit = 10, search = "", sort = "username", order = "asc" } = {}) {
  let query = db("github_profiles");

  if (search) {
    query = query.where(function() {
      this.where("username", "like", `%${search}%`)
          .orWhere("name", "like", `%${search}%`);
    });
  }

  // Prevent SQL injection by validating sorting columns
  const allowedSortColumns = [
    "username",
    "name",
    "public_repos",
    "followers",
    "following",
    "public_gists",
    "account_age_years",
    "popularity_score",
    "created_at",
    "updated_at"
  ];
  
  const sortColumn = allowedSortColumns.includes(sort) ? sort : "username";
  const sortOrder = ["asc", "desc"].includes(order.toLowerCase()) ? order.toLowerCase() : "asc";

  // Get total count for pagination metadata
  const totalCountResult = await query.clone().count("* as count").first();
  const total = totalCountResult ? totalCountResult.count : 0;

  // Pagination bounds
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.max(1, parseInt(limit) || 10);
  const offset = (parsedPage - 1) * parsedLimit;

  const data = await query
    .orderBy(sortColumn, sortOrder)
    .limit(parsedLimit)
    .offset(offset);

  return {
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
    data
  };
}

export async function getProfileByUsername(username) {
  if (!username) return null;
  return await db("github_profiles")
    .whereRaw("LOWER(username) = ?", [username.toLowerCase()])
    .first();
}

export async function deleteProfile(username) {
  if (!username) return 0;
  return await db("github_profiles")
    .whereRaw("LOWER(username) = ?", [username.toLowerCase()])
    .del();
}

export async function getStats() {
  const stats = await db("github_profiles")
    .count("* as total_profiles")
    .avg("followers as avg_followers")
    .avg("public_repos as avg_repos")
    .max("popularity_score as highest_popularity_score")
    .first();

  return {
    total_profiles: stats.total_profiles || 0,
    avg_followers: Math.round((stats.avg_followers || 0) * 100) / 100,
    avg_repos: Math.round((stats.avg_repos || 0) * 100) / 100,
    highest_popularity_score: stats.highest_popularity_score || 0
  };
}
