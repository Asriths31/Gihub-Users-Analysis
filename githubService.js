import axios from "axios";

function createError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export async function fetchAndAnalyzeProfile(username) {
  if (!username) {
    throw createError("Username is required.", 400);
  }

  const headers = {
    "User-Agent": "Node.js-Axios-App"
  };

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
    const profile = response.data;

    const githubCreatedAt = new Date(profile.created_at);
    const ageInYears = (Date.now() - githubCreatedAt.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    const accountAgeYears = Math.max(0, Math.round(ageInYears * 100) / 100);
    const popularityScore = (profile.followers * 10) + profile.public_repos + (profile.public_gists * 5);    
    const rawFollowersPerRepo = profile.public_repos > 0 ? (profile.followers / profile.public_repos) : 0;
    const followersPerRepo = Math.round(rawFollowersPerRepo * 10000) / 10000;

    const rawRepoPerFollower = profile.followers > 0 ? (profile.public_repos / profile.followers) : 0;
    const repoPerFollower = Math.round(rawRepoPerFollower * 10000) / 10000;

    return {
      username: profile.login,
      name: profile.name || null,
      avatar_url: profile.avatar_url || null,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      public_gists: profile.public_gists,
      github_created_at: profile.created_at,
      account_age_years: accountAgeYears,
      popularity_score: popularityScore,
      followers_per_repo: followersPerRepo,
      repo_per_follower: repoPerFollower
    };
  } catch (err) {
    if (err.response) {
      if (err.response.status === 404) {
        throw createError("GitHub user not found.", 404);
      }
      if (err.response.status === 403 || err.response.status === 429) {
        throw createError("GitHub API rate limit exceeded. Please try again later.", 429);
      }
    }
    console.error("Error fetching from GitHub API:", err.message);
    throw createError("Error connecting to GitHub API.", 502);
  }
}
