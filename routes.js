import { Router } from "express";
import {
  getUserDetails,
  analyzeGithubProfile,
  getGithubProfiles,
  getGithubProfileByUsername,
  refreshGithubProfile,
  deleteGithubProfile,
  getGithubStats
} from "./controllers.js";

export const routes = Router();

// Legacy route
routes.get("/getUserDetails", getUserDetails);

// GitHub Profile Analyzer routes
routes.post("/github/:username", analyzeGithubProfile);
routes.get("/github", getGithubProfiles);
routes.get("/github/stats", getGithubStats); // Declared before /github/:username to prevent parameter collision
routes.get("/github/:username", getGithubProfileByUsername);
routes.put("/github/:username", refreshGithubProfile);
routes.delete("/github/:username", deleteGithubProfile);