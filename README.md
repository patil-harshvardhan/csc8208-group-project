# Branching Rules

## Branch Naming Convention

- **Feature branches**: `feature/{issue_number}-{short_description}`
  - Example: `feature/123-add-new-feature`

- **Bugfix branches**: `bugfix/{issue_number}-{short_description}`
  - Example: `bugfix/456-fix-bug`

- **Hotfix branches**: `hotfix/{version_number}-{short_description}`
  - Example: `hotfix/1.0.1-security-patch`

- **Release branches**: `release/{version_number}`
  - Example: `release/1.0.0`

## Pull Request Guidelines

1. **Branch Targeting:**
   - Feature branches must be merged into `develop`.
   - Bugfix branches must be merged into `develop`.
   - Hotfix branches must be merged into both `develop` and `main`.

2. **Pull Request Title:**
   - Use a concise and descriptive title summarizing the changes.

3. **Description:**
   - Provide a detailed description of the changes made.
   - Include any relevant context, issues addressed, or dependencies.

4. **Reviewers:**
   - Assign at least one team member to review the pull request.

5. **Labels:**
   - Apply appropriate labels such as `feature`, `bugfix`, or `hotfix`.

6. **Tests:**
   - Ensure that automated tests pass successfully.
   - Include manual testing instructions if applicable.

7. **Documentation:**
   - Update documentation for any relevant changes.

## Code Review Process

1. **Reviewers:**
   - Reviewers should thoroughly inspect the code changes.
   - Provide constructive feedback and suggest improvements.

2. **Discussion:**
   - Address any comments or concerns raised during the review.
   - Collaborate with the author to resolve issues.

3. **Approval:**
   - Require approval from at least one reviewer before merging.

## Merging Guidelines

1. **Squash Commits:**
   - Squash multiple commits into a single, logical commit before merging.

2. **Merge Commits:**
   - Use "Merge pull request" for feature and bugfix branches.
   - Use "Squash and merge" for hotfix branches.

3. **Delete Branch:**
   - Delete the feature, bugfix, or hotfix branch after merging.

## Example Commands

```bash
# Create a new feature branch
git checkout -b feature/123-add-new-feature

# Push the branch to remote
git push origin feature/123-add-new-feature

# Create a pull request targeting 'develop'
# Ensure tests pass and address reviewer feedback
