# GitHub Profile Analyzer API Documentation

This document describes the API endpoints, parameters, request/response formats, and includes a Postman collection representation for testing.

---

## Base URL

All requests must be sent to:
```text
https://gihub-users-analysis.onrender.com/api
```

---

## Authentication

> These endpoints are public and do not require authentication.

---

## Standard Response Format

Every API endpoint follows a standard response contract.

### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message.",
  "errors": null
}
```

### Validation Error Response Format
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "username",
      "message": "Username is required."
    }
  ]
}
```

---

## HTTP Status Codes Used

| Status | Meaning | Usage |
| :--- | :--- | :--- |
| **200** | Success | Standard GET, PUT, and DELETE success |
| **201** | Created | Profile successfully fetched, analyzed, and stored |
| **400** | Bad Request | Missing or invalid parameters |
| **404** | Not Found | User or profile does not exist |
| **429** | Too Many Requests | GitHub API rate limit exceeded |
| **500** | Internal Error | Server or database issue |

---

# Endpoints

## 1. Analyze Profile (POST)
`POST /github/:username`

### Purpose
Fetches the latest GitHub profile from the public API, performs analytical calculations, and saves/updates it in the SQLite database.

### Path Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string | Yes | GitHub username to analyze |

### Request Example
`POST http://localhost:2000/api/github/octocat`

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "GitHub profile analyzed and saved successfully.",
  "data": {
    "username": "octocat",
    "name": "The Octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
    "public_repos": 8,
    "followers": 3939,
    "following": 9,
    "public_gists": 8,
    "github_created_at": "2011-01-25T18:44:36Z",
    "account_age_years": 15.45,
    "popularity_score": 39438,
    "followers_per_repo": 492.375,
    "repo_per_follower": 0.002,
    "created_at": "2026-07-06T11:45:00.000Z",
    "updated_at": "2026-07-06T11:45:00.000Z"
  }
}
```

### Error Responses
- **400 Bad Request**
  ```json
  {
    "success": false,
    "message": "Validation failed.",
    "errors": [
      {
        "field": "username",
        "message": "Username is required."
      }
    ]
  }
  ```
- **404 Not Found (GitHub User Not Found)**
  ```json
  {
    "success": false,
    "message": "GitHub user not found.",
    "errors": null
  }
  ```
- **429 Rate Limit**
  ```json
  {
    "success": false,
    "message": "GitHub API rate limit exceeded. Please try again later.",
    "errors": null
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "success": false,
    "message": "Something went wrong. Please try again later.",
    "errors": null
  }
  ```

---

## 2. Get All Profiles (GET)
`GET /github`

### Purpose
Returns all analyzed GitHub profiles stored in the local SQLite database. Supports searching, sorting, and pagination.


### Request Example
`GET http://localhost:2000/api/github?page=1&limit=5&sort=popularity_score&order=desc&search=octo`

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Profiles retrieved successfully.",
  "data": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "data": [
      {
        "username": "octocat",
        "name": "The Octocat",
        "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
        "public_repos": 8,
        "followers": 3939,
        "following": 9,
        "public_gists": 8,
        "github_created_at": "2011-01-25T18:44:36Z",
        "account_age_years": 15.45,
        "popularity_score": 39438,
        "followers_per_repo": 492.375,
        "repo_per_follower": 0.002,
        "created_at": "2026-07-06T11:45:00.000Z",
        "updated_at": "2026-07-06T11:45:00.000Z"
      }
    ]
  }
}
```

---

## 3. Get Single Profile (GET)
`GET /github/:username`

### Purpose
Retrieves a single analyzed profile from the SQLite database (case-insensitive).

### Path Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string | Yes | Username to search in DB |

### Request Example
`GET http://localhost:2000/api/github/octocat`

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Profile retrieved successfully.",
  "data": {
    "username": "octocat",
    "name": "The Octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
    "public_repos": 8,
    "followers": 3939,
    "following": 9,
    "public_gists": 8,
    "github_created_at": "2011-01-25T18:44:36Z",
    "account_age_years": 15.45,
    "popularity_score": 39438,
    "followers_per_repo": 492.375,
    "repo_per_follower": 0.002,
    "created_at": "2026-07-06T11:45:00.000Z",
    "updated_at": "2026-07-06T11:45:00.000Z"
  }
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Profile not found in database.",
  "errors": null
}
```

---

## 4. Refresh Profile (PUT)
`PUT /github/:username`

### Purpose
Fetches the latest details from the GitHub API and updates the local SQLite database.

### Path Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string | Yes | Username to refresh |

### Request Example
`PUT http://localhost:2000/api/github/octocat`

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "GitHub profile refreshed successfully.",
  "data": {
    "username": "octocat",
    "name": "The Octocat",
    "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
    "public_repos": 8,
    "followers": 3950,
    "following": 9,
    "public_gists": 8,
    "github_created_at": "2011-01-25T18:44:36Z",
    "account_age_years": 15.45,
    "popularity_score": 39548,
    "followers_per_repo": 493.75,
    "repo_per_follower": 0.002,
    "created_at": "2026-07-06T11:45:00.000Z",
    "updated_at": "2026-07-06T11:48:00.000Z"
  }
}
```

---

## 5. Delete Profile (DELETE)
`DELETE /github/:username`

### Purpose
Deletes an analyzed profile from the SQLite database.

### Path Parameters
| Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | string | Yes | Username to delete |

### Request Example
`DELETE http://localhost:2000/api/github/octocat`

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Profile deleted successfully.",
  "data": null
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Profile not found in database.",
  "errors": null
}
```

---

## 6. Statistics (GET)
`GET /github/stats`

### Purpose
Calculates project-wide analytics metrics based on all saved records.

### Request Example
`GET http://localhost:2000/api/github/stats`

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Statistics retrieved successfully.",
  "data": {
    "total_profiles": 5,
    "avg_followers": 820.4,
    "avg_repos": 14.6,
    "highest_popularity_score": 39438
  }
}
```

---

## Postman Collection

Copy and save the JSON below into a file (e.g., `GithubAnalyzer.postman_collection.json`) to import directly into Postman.

```json
{
  "info": {
    "_postman_id": "8b5d3a33-6cfb-4e89-9a25-c6bbf8dbb4c1",
    "name": "GitHub Profile Analyzer",
    "description": "API collection to interact with the GitHub Profile Analyzer service.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Analyze Profile",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:2000/api/github/octocat",
          "protocol": "http",
          "host": ["localhost"],
          "port": "2000",
          "path": ["api", "github", "octocat"]
        }
      },
      "response": []
    },
    {
      "name": "Get All Profiles",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:2000/api/github",
          "protocol": "http",
          "host": ["localhost"],
          "port": "2000",
          "path": ["api", "github"],
          "query": [
            { "key": "page", "value": "1" },
            { "key": "limit", "value": "10" },
            { "key": "search", "value": "" },
            { "key": "sort", "value": "popularity_score" },
            { "key": "order", "value": "desc" }
          ]
        }
      },
      "response": []
    },
    {
      "name": "Get Single Profile",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:2000/api/github/octocat",
          "protocol": "http",
          "host": ["localhost"],
          "port": "2000",
          "path": ["api", "github", "octocat"]
        }
      },
      "response": []
    },
    {
      "name": "Refresh Profile",
      "request": {
        "method": "PUT",
        "header": [],
        "url": {
          "raw": "http://localhost:2000/api/github/octocat",
          "protocol": "http",
          "host": ["localhost"],
          "port": "2000",
          "path": ["api", "github", "octocat"]
        }
      },
      "response": []
    },
    {
      "name": "Delete Profile",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "http://localhost:2000/api/github/octocat",
          "protocol": "http",
          "host": ["localhost"],
          "port": "2000",
          "path": ["api", "github", "octocat"]
        }
      },
      "response": []
    },
    {
      "name": "Get Statistics",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:2000/api/github/stats",
          "protocol": "http",
          "host": ["localhost"],
          "port": "2000",
          "path": ["api", "github", "stats"]
        }
      },
      "response": []
    }
  ]
}
```
