const fs = require("fs");
const path = require("path");
const https = require("https");

// Configuration
const GITHUB_USERNAME = "AhoyLemon";
const OUTPUT_DIR = path.join(__dirname, "..", "..", "stats");
const YAML_FILE = path.join(OUTPUT_DIR, "github-stats.yml");
const MARKDOWN_FILE = path.join(OUTPUT_DIR, "github-stats.md");
const BADGES_DIR = path.join(OUTPUT_DIR, "badges");

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(BADGES_DIR)) {
  fs.mkdirSync(BADGES_DIR, { recursive: true });
}

/**
 * Make a GitHub GraphQL API request
 */
function githubGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });

    const options = {
      hostname: "api.github.com",
      path: "/graphql",
      method: "POST",
      headers: {
        "User-Agent": "GitHub-Stats-Collector",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
        Authorization: `bearer ${process.env.GITHUB_TOKEN || ""}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            if (result.errors) {
              reject(new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`));
            } else {
              resolve(result.data);
            }
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Make a GitHub REST API request
 */
function githubApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: endpoint,
      method: "GET",
      headers: {
        "User-Agent": "GitHub-Stats-Collector",
        Accept: "application/vnd.github.v3+json",
      },
    };

    // Add authentication if available
    if (process.env.GITHUB_TOKEN) {
      options.headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}

/**
 * Get comprehensive user statistics using GraphQL
 */
async function getUserStats() {
  const query = `
    query($login: String!) {
      user(login: $login) {
        name
        bio
        location
        websiteUrl
        followers {
          totalCount
        }
        following {
          totalCount
        }
        createdAt
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          restrictedContributionsCount
        }
        repositories(first: 100, privacy: PUBLIC) {
          totalCount
          nodes {
            name
            isPrivate
            isFork
            stargazerCount
            forkCount
            watchers {
              totalCount
            }
          }
        }
        issues {
          totalCount
        }
        pullRequests {
          totalCount
        }
      }
    }
  `;

  const data = await githubGraphQLRequest(query, { login: GITHUB_USERNAME });
  
  // Fetch gists separately with error handling (not available with GitHub Actions token)
  let gistsCount = 0;
  try {
    const gistsQuery = `
      query($login: String!) {
        user(login: $login) {
          gists {
            totalCount
          }
        }
      }
    `;
    const gistsData = await githubGraphQLRequest(gistsQuery, { login: GITHUB_USERNAME });
    gistsCount = gistsData.user.gists.totalCount;
  } catch (error) {
    console.log('⚠️  Gists count not available (requires additional permissions)');
  }
  
  return { ...data.user, gistsCount };
}

/**
 * Get detailed PR and issue statistics
 */
async function getDetailedContributions() {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pullRequests(first: 1) {
          totalCount
        }
        openPullRequests: pullRequests(first: 1, states: OPEN) {
          totalCount
        }
        closedPullRequests: pullRequests(first: 1, states: [CLOSED, MERGED]) {
          totalCount
        }
        issues(first: 1) {
          totalCount
        }
        openIssues: issues(first: 1, states: OPEN) {
          totalCount
        }
        closedIssues: issues(first: 1, states: CLOSED) {
          totalCount
        }
      }
    }
  `;

  const data = await githubGraphQLRequest(query, { login: GITHUB_USERNAME });
  return data.user;
}

/**
 * Get ALL repositories (including private) with pagination
 */
async function getAllRepositories() {
  let allRepos = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const query = `
      query($login: String!, $cursor: String) {
        user(login: $login) {
          repositories(first: 100, after: $cursor, ownerAffiliations: OWNER) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              name
              isPrivate
              isFork
              stargazerCount
              forkCount
              watchers {
                totalCount
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await githubGraphQLRequest(query, { login: GITHUB_USERNAME, cursor });
    const repos = data.user.repositories;

    allRepos = allRepos.concat(repos.nodes);
    hasNextPage = repos.pageInfo.hasNextPage;
    cursor = repos.pageInfo.endCursor;

    console.log(`  📦 Fetched ${allRepos.length} repositories...`);
  }

  return allRepos;
}

/**
 * Collect all GitHub statistics
 */
async function collectStats() {
  console.log("🚀 Fetching GitHub statistics...\n");

  if (!process.env.GITHUB_TOKEN) {
    console.log("⚠️  WARNING: No GITHUB_TOKEN found. Private repo data will not be available.");
    console.log("   Set GITHUB_TOKEN environment variable for complete statistics.\n");
  }

  try {
    // Get user profile and basic stats
    console.log("👤 Fetching user profile...");
    const user = await getUserStats();
    console.log(`✅ Found user: ${user.name || GITHUB_USERNAME}`);

    // Get detailed PR and issue counts
    console.log("🔍 Fetching detailed contribution statistics...");
    const contributions = await getDetailedContributions();
    console.log(`✅ Found ${contributions.pullRequests.totalCount} PRs and ${contributions.issues.totalCount} issues`);

    // Get all repositories with full details
    console.log("📦 Fetching ALL repositories (including private)...");
    const repos = await getAllRepositories();
    console.log(`✅ Found ${repos.length} total repositories`);

    // Calculate repository statistics
    const publicRepos = repos.filter((r) => !r.isPrivate).length;
    const privateRepos = repos.filter((r) => r.isPrivate).length;
    const forkedRepos = repos.filter((r) => r.isFork).length;
    const originalRepos = repos.filter((r) => !r.isFork).length;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazerCount, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forkCount, 0);
    const totalWatchers = repos.reduce((sum, repo) => sum + (repo.watchers?.totalCount || 0), 0);

    // Calculate total commits across ALL repos
    console.log("💾 Calculating total commits across all repositories...");
    let totalCommits = 0;
    for (const repo of repos) {
      if (repo.defaultBranchRef?.target?.history) {
        totalCommits += repo.defaultBranchRef.target.history.totalCount;
      }
    }
    console.log(`✅ Found ${totalCommits} total commits`);

    // Get lifetime contribution stats
    const lifetimeCommits = user.contributionsCollection.totalCommitContributions;
    const restrictedCommits = user.contributionsCollection.restrictedContributionsCount;

    // Compile comprehensive statistics
    const stats = {
      lastUpdated: new Date().toISOString(),
      username: GITHUB_USERNAME,
      profile: {
        name: user.name,
        bio: user.bio,
        location: user.location,
        website: user.websiteUrl,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        publicGists: user.gistsCount || 0,
        createdAt: user.createdAt,
      },
      repositories: {
        total: repos.length,
        public: publicRepos,
        private: privateRepos,
        original: originalRepos,
        forked: forkedRepos,
      },
      engagement: {
        totalStars: totalStars,
        totalForks: totalForks,
        totalWatchers: totalWatchers,
      },
      contributions: {
        commits: {
          total: totalCommits,
          thisYear: lifetimeCommits,
          restricted: restrictedCommits,
          note: "Total commits across all repository default branches",
        },
        pullRequests: {
          total: contributions.pullRequests.totalCount,
          open: contributions.openPullRequests.totalCount,
          closed: contributions.closedPullRequests.totalCount,
        },
        issues: {
          total: contributions.issues.totalCount,
          open: contributions.openIssues.totalCount,
          closed: contributions.closedIssues.totalCount,
        },
        reviews: user.contributionsCollection.totalPullRequestReviewContributions,
      },
    };

    return stats;
  } catch (error) {
    console.error("❌ Error collecting stats:", error.message);
    if (error.message.includes("401") || error.message.includes("authentication")) {
      console.error("💡 Make sure GITHUB_TOKEN environment variable is set");
    }
    throw error;
  }
}

/**
 * Save statistics to YAML file
 */
function saveToYAML(stats) {
  console.log("\n📝 Saving to YAML...");

  // Simple YAML serialization (no external dependencies)
  let yaml = `# GitHub Statistics for ${stats.username}\n`;
  yaml += `# Last Updated: ${stats.lastUpdated}\n\n`;
  yaml += `lastUpdated: "${stats.lastUpdated}"\n`;
  yaml += `username: "${stats.username}"\n\n`;

  yaml += `profile:\n`;
  yaml += `  name: "${stats.profile.name || ""}"\n`;
  yaml += `  bio: "${(stats.profile.bio || "").replace(/"/g, '\\"')}"\n`;
  yaml += `  location: "${stats.profile.location || ""}"\n`;
  yaml += `  website: "${stats.profile.website || ""}"\n`;
  yaml += `  followers: ${stats.profile.followers}\n`;
  yaml += `  following: ${stats.profile.following}\n`;
  yaml += `  publicGists: ${stats.profile.publicGists}\n`;
  yaml += `  createdAt: "${stats.profile.createdAt}"\n\n`;

  yaml += `repositories:\n`;
  yaml += `  total: ${stats.repositories.total}\n`;
  yaml += `  public: ${stats.repositories.public}\n`;
  yaml += `  private: ${stats.repositories.private}\n`;
  yaml += `  original: ${stats.repositories.original}\n`;
  yaml += `  forked: ${stats.repositories.forked}\n\n`;

  yaml += `engagement:\n`;
  yaml += `  totalStars: ${stats.engagement.totalStars}\n`;
  yaml += `  totalForks: ${stats.engagement.totalForks}\n`;
  yaml += `  totalWatchers: ${stats.engagement.totalWatchers}\n\n`;

  yaml += `contributions:\n`;
  yaml += `  commits:\n`;
  yaml += `    total: ${stats.contributions.commits.total}\n`;
  yaml += `    thisYear: ${stats.contributions.commits.thisYear}\n`;
  yaml += `    restricted: ${stats.contributions.commits.restricted}\n`;
  yaml += `    note: "${stats.contributions.commits.note}"\n`;
  yaml += `  pullRequests:\n`;
  yaml += `    total: ${stats.contributions.pullRequests.total}\n`;
  yaml += `    open: ${stats.contributions.pullRequests.open}\n`;
  yaml += `    closed: ${stats.contributions.pullRequests.closed}\n`;
  yaml += `  issues:\n`;
  yaml += `    total: ${stats.contributions.issues.total}\n`;
  yaml += `    open: ${stats.contributions.issues.open}\n`;
  yaml += `    closed: ${stats.contributions.issues.closed}\n`;
  yaml += `  reviews: ${stats.contributions.reviews}\n`;

  fs.writeFileSync(YAML_FILE, yaml, "utf8");
  console.log(`✅ YAML saved to: ${YAML_FILE}`);
}

/**
 * Generate markdown table
 */
function generateMarkdown(stats) {
  console.log("📊 Generating markdown table...");

  let md = `# GitHub Statistics for ${stats.profile.name || stats.username}\n\n`;
  md += `*Last updated: ${new Date(stats.lastUpdated).toLocaleString()}*\n\n`;

  md += `## 📊 Overview\n\n`;
  md += `| Category | Statistic | Count |\n`;
  md += `|----------|-----------|-------|\n`;
  md += `| **Profile** | Followers | ${stats.profile.followers} |\n`;
  md += `| | Following | ${stats.profile.following} |\n`;
  md += `| | Public Gists | ${stats.profile.publicGists} |\n`;
  md += `| **Repositories** | Total Repos | ${stats.repositories.total} |\n`;
  md += `| | Public Repos | ${stats.repositories.public} |\n`;
  md += `| | Private Repos | ${stats.repositories.private} |\n`;
  md += `| | Original Repos | ${stats.repositories.original} |\n`;
  md += `| | Forked Repos | ${stats.repositories.forked} |\n`;
  md += `| **Engagement** | Total Stars ⭐ | ${stats.engagement.totalStars} |\n`;
  md += `| | Total Forks 🍴 | ${stats.engagement.totalForks} |\n`;
  md += `| | Total Watchers 👀 | ${stats.engagement.totalWatchers} |\n`;
  md += `| **Contributions** | Total Commits 💾 | ${stats.contributions.commits.total.toLocaleString()} |\n`;
  md += `| | Commits This Year | ${stats.contributions.commits.thisYear.toLocaleString()} |\n`;
  md += `| | Pull Requests | ${stats.contributions.pullRequests.total} |\n`;
  md += `| | Open PRs | ${stats.contributions.pullRequests.open} |\n`;
  md += `| | Closed/Merged PRs | ${stats.contributions.pullRequests.closed} |\n`;
  md += `| | Issues | ${stats.contributions.issues.total} |\n`;
  md += `| | Open Issues | ${stats.contributions.issues.open} |\n`;
  md += `| | Closed Issues | ${stats.contributions.issues.closed} |\n`;
  md += `| | PR Reviews | ${stats.contributions.reviews} |\n`;

  md += `\n## 🎯 Highlights\n\n`;
  md += `- 📦 **${stats.repositories.total}** repositories (${stats.repositories.public} public, ${stats.repositories.private} private)\n`;
  md += `- ⭐ **${stats.engagement.totalStars}** stars received\n`;
  md += `- 👥 **${stats.profile.followers}** followers\n`;
  md += `- 💾 **${stats.contributions.commits.total.toLocaleString()}** total commits\n`;
  md += `- 🔀 **${stats.contributions.pullRequests.total}** pull requests (${stats.contributions.pullRequests.open} open)\n`;
  md += `- 🐛 **${stats.contributions.issues.total}** issues (${stats.contributions.issues.open} open)\n`;
  md += `- 👀 **${stats.contributions.reviews}** pull request reviews\n`;

  md += `\n---\n`;
  md += `\n*${stats.contributions.commits.note}*\n`;
  md += `\n*Generated automatically by [fetch-github-stats.js](../../scripts/npm/fetch-github-stats.js)*\n`;

  fs.writeFileSync(MARKDOWN_FILE, md, "utf8");
  console.log(`✅ Markdown saved to: ${MARKDOWN_FILE}`);
}

/**
 * Generate two-tier SVG badges with dark mode support
 */
function generateBadges(stats) {
  console.log("🎨 Generating SVG badges...");

  const badges = [
    {
      name: "repos",
      topLabel: "Repositories",
      topValue: stats.repositories.total.toLocaleString(),
      bottomLabel: "Public Repos",
      bottomValue: stats.repositories.public.toLocaleString(),
    },
    {
      name: "commits",
      topLabel: "Commits",
      topValue: stats.contributions.commits.total.toLocaleString(),
      bottomLabel: "This Year",
      bottomValue: stats.contributions.commits.thisYear.toLocaleString(),
    },
    {
      name: "prs",
      topLabel: "Pull Requests",
      topValue: stats.contributions.pullRequests.total.toLocaleString(),
      bottomLabel: "Closed PRs",
      bottomValue: stats.contributions.pullRequests.closed.toLocaleString(),
    },
    {
      name: "issues",
      topLabel: "Issues Created",
      topValue: stats.contributions.issues.total.toLocaleString(),
      bottomLabel: "Closed Issues",
      bottomValue: stats.contributions.issues.closed.toLocaleString(),
    },
  ];

  badges.forEach((badge) => {
    const svg = createTwoTierBadge(badge);
    const badgePath = path.join(BADGES_DIR, `${badge.name}.svg`);
    fs.writeFileSync(badgePath, svg, "utf8");
    console.log(`  ✅ Created badge: ${badge.name}.svg`);
  });
}

/**
 * Create a two-tier badge with dark mode support
 */
function createTwoTierBadge(badge) {
  const { topLabel, topValue, bottomLabel, bottomValue } = badge;

  // Calculate widths based on content
  const labelWidth = Math.max(topLabel.length * 7, bottomLabel.length * 7) + 20;
  const valueWidth = Math.max(String(topValue).length * 7, String(bottomValue).length * 7) + 20;
  const totalWidth = labelWidth + valueWidth;
  const height = 40; // Two rows

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="${topLabel}: ${topValue}, ${bottomLabel}: ${bottomValue}">
  <title>${topLabel}: ${topValue}, ${bottomLabel}: ${bottomValue}</title>
  <style>
    .label-bg { fill: #555; }
    .value-bg { fill: #777; }
    .label-text { fill: #fff; }
    .value-text { fill: #fff; }
    .divider { stroke: #444; }
    
    @media (prefers-color-scheme: dark) {
      .label-bg { fill: #2d333b; }
      .value-bg { fill: #444c56; }
      .label-text { fill: #adbac7; }
      .value-text { fill: #cdd9e5; }
      .divider { stroke: #545d68; }
    }
    
    @media (prefers-color-scheme: light) {
      .label-bg { fill: #e1e4e8; }
      .value-bg { fill: #fafbfc; }
      .label-text { fill: #24292e; }
      .value-text { fill: #24292e; }
      .divider { stroke: #d1d5da; }
    }
  </style>
  
  <!-- Top row background -->
  <rect class="label-bg" width="${labelWidth}" height="20" x="0" y="0"/>
  <rect class="value-bg" width="${valueWidth}" height="20" x="${labelWidth}" y="0"/>
  
  <!-- Bottom row background -->
  <rect class="label-bg" width="${labelWidth}" height="20" x="0" y="20"/>
  <rect class="value-bg" width="${valueWidth}" height="20" x="${labelWidth}" y="20"/>
  
  <!-- Divider lines -->
  <line class="divider" x1="0" y1="20" x2="${totalWidth}" y2="20" stroke-width="1"/>
  <line class="divider" x1="${labelWidth}" y1="0" x2="${labelWidth}" y2="${height}" stroke-width="1"/>
  
  <!-- Text -->
  <g font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <!-- Top row -->
    <text class="label-text" x="${labelWidth - 5}" y="14" text-anchor="end">${topLabel}</text>
    <text class="value-text" x="${labelWidth + 5}" y="14" text-anchor="start" font-weight="bold">${topValue}</text>
    
    <!-- Bottom row -->
    <text class="label-text" x="${labelWidth - 5}" y="34" text-anchor="end" font-size="10">${bottomLabel}</text>
    <text class="value-text" x="${labelWidth + 5}" y="34" text-anchor="start" font-size="10">${bottomValue}</text>
  </g>
</svg>`;
}

/**
 * Main execution
 */
async function main() {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   GitHub Statistics Collector v1.0         ║");
  console.log("╚════════════════════════════════════════════╝\n");

  try {
    // Collect statistics
    const stats = await collectStats();

    // Save to different formats
    saveToYAML(stats);
    generateMarkdown(stats);
    generateBadges(stats);

    console.log("\n✨ Done! Statistics collected successfully.\n");
    console.log(`📁 Output files:`);
    console.log(`   - ${YAML_FILE}`);
    console.log(`   - ${MARKDOWN_FILE}`);
    console.log(`   - ${BADGES_DIR}/`);
    console.log("\n💡 You can now use these badges in your README:\n");
    console.log(`   ![Repos](https://raw.githubusercontent.com/AhoyLemon/xyz/main/stats/badges/repos.svg)`);
    console.log(`   ![Commits](https://raw.githubusercontent.com/AhoyLemon/xyz/main/stats/badges/commits.svg)`);
    console.log(`   ![PRs](https://raw.githubusercontent.com/AhoyLemon/xyz/main/stats/badges/prs.svg)`);
    console.log(`   ![Issues](https://raw.githubusercontent.com/AhoyLemon/xyz/main/stats/badges/issues.svg)`);
  } catch (error) {
    console.error("\n❌ Failed to collect statistics:", error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { collectStats, saveToYAML, generateMarkdown, generateBadges };
