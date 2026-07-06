import axios from "axios";
import * as githubService from "./githubService.js";
import * as githubModel from "./githubModel.js";

function handleError(err, res) {
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: null
    });
  }
  console.error("Unhandle controller error:", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
    errors: null
  });
}

export async function getUserDetails(req, res) {
  try {
    let { username } = req.query;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username query parameter is required.",
        errors: [{ field: "username", message: "Username is required." }]
      });
    }
    let userData = await axios.get(`https://api.github.com/users/${username}`, {
      headers: {
        "User-Agent": "Node.js-Axios-App"
      }
    });
    console.log("UserData in getUserData", userData.data, username);
    return res.status(200).json({
      success: true,
      message: "Fetched user details from GitHub successfully.",
      data: userData.data
    });
  } catch (err) {
    console.log("Error in getUserDetails", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function analyzeGithubProfile(req, res) {
  try {
    const { username } = req.params;
    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: [{ field: "username", message: "Username is required." }]
      });
    }

    const analyzedData = await githubService.fetchAndAnalyzeProfile(username);
    
    await githubModel.upsertProfile(analyzedData);

    const record = await githubModel.getProfileByUsername(username);

    return res.status(201).json({
      success: true,
      message: "GitHub profile analyzed and saved successfully.",
      data: record
    });
  } catch (err) {
    return handleError(err, res);
  }
}


export async function getGithubProfiles(req, res) {
  try {
    const { page = 1, limit = 10, search = "", sort = "username", order = "asc" } = req.query;
    
    const results = await githubModel.getAllProfiles({ page, limit, search, sort, order });
    
    return res.status(200).json({
      success: true,
      message: "Profiles retrieved successfully.",
      data: results
    });
  } catch (err) {
    return handleError(err, res);
  }
}

export async function getGithubProfileByUsername(req, res) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
        errors: [{ field: "username", message: "Username is required." }]
      });
    }

    const record = await githubModel.getProfileByUsername(username);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Profile not found in database.",
        errors: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      data: record
    });
  } catch (err) {
    return handleError(err, res);
  }
}


export async function refreshGithubProfile(req, res) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
        errors: [{ field: "username", message: "Username is required." }]
      });
    }

    const analyzedData = await githubService.fetchAndAnalyzeProfile(username);
    
    await githubModel.upsertProfile(analyzedData);

    const record = await githubModel.getProfileByUsername(username);

    return res.status(200).json({
      success: true,
      message: "GitHub profile refreshed successfully.",
      data: record
    });
  } catch (err) {
    return handleError(err, res);
  }
}

export async function deleteGithubProfile(req, res) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
        errors: [{ field: "username", message: "Username is required." }]
      });
    }

    const deletedCount = await githubModel.deleteProfile(username);
    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found in database.",
        errors: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
      data: null
    });
  } catch (err) {
    return handleError(err, res);
  }
}

export async function getGithubStats(req, res) {
  try {
    const stats = await githubModel.getStats();
    return res.status(200).json({
      success: true,
      message: "Statistics retrieved successfully.",
      data: stats
    });
  } catch (err) {
    return handleError(err, res);
  }
}