const { Octokit } = require('@octokit/rest');

class GitHubHandler {
    constructor(token, repo, owner) {
        this.octokit = new Octokit({
            auth: token
        });
        this.repo = repo;
        this.owner = owner;
    }

    async createOrUpdateFile(path, content, message) {
        try {
            // First try to get the file to see if it exists
            let sha;
            try {
                const { data } = await this.octokit.repos.getContent({
                    owner: this.owner,
                    repo: this.repo,
                    path,
                });
                sha = data.sha;
            } catch (e) {
                // File doesn't exist yet, which is fine
            }

            // Create or update the file
            const response = await this.octokit.repos.createOrUpdateFileContents({
                owner: this.owner,
                repo: this.repo,
                path,
                message,
                content: Buffer.from(content).toString('base64'),
                sha: sha
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Error in createOrUpdateFile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = GitHubHandler;
