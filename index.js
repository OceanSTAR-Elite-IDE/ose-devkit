require('dotenv').config();
const axios = require('axios');

// GitLab API configuration
const gitlabConfig = {
  baseURL: process.env.GITLAB_API_URL,
  headers: {
    'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN
  }
};

// GitHub API configuration
const githubConfig = {
  baseURL: process.env.GITHUB_API_URL,
  headers: {
    'Authorization': `token ${process.env.GITHUB_API_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
};

// Create API clients
const gitlabClient = axios.create(gitlabConfig);
const githubClient = axios.create(githubConfig);

async function getGitLabIssues() {
  try {
    const response = await gitlabClient.get(`/projects/${process.env.GITLAB_PROJECT_ID}/issues`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitLab issues:', error.message);
    throw error;
  }
}

async function createGitHubIssue(issue) {
  try {
    const githubIssue = {
      title: issue.title,
      body: `${issue.description}\n\n---\nMigrated from GitLab Issue #${issue.iid}`,
      labels: issue.labels || []
    };

    const response = await githubClient.post(
      `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/issues`,
      githubIssue
    );
    
    console.log(`Created GitHub issue #${response.data.number}: ${issue.title}`);
    return response.data;
  } catch (error) {
    console.error(`Error creating GitHub issue for "${issue.title}":`, error.message);
    throw error;
  }
}

async function migrateIssues() {
  try {
    console.log('Starting migration...');
    const issues = await getGitLabIssues();
    console.log(`Found ${issues.length} issues to migrate`);

    for (const issue of issues) {
      await createGitHubIssue(issue);
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

// Run the migration
migrateIssues(); 