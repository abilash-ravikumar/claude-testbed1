# CLAUDE.md - AI Assistant Guide for claude-testbed1

**Last Updated:** 2025-11-15
**Repository:** abilash-ravikumar/claude-testbed1
**Purpose:** Test repository for AI-assisted development workflows

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Current State](#current-state)
3. [Development Workflow](#development-workflow)
4. [Git Branching Strategy](#git-branching-strategy)
5. [Code Conventions](#code-conventions)
6. [AI Assistant Guidelines](#ai-assistant-guidelines)
7. [Common Tasks](#common-tasks)
8. [Future Development](#future-development)

---

## Repository Overview

### Purpose

`claude-testbed1` is a test repository designed for:
- Experimenting with AI-assisted development workflows
- Testing Claude Code integration and capabilities
- Prototyping new features and ideas
- Validating development processes

### Repository Information

- **Owner:** abilash-ravikumar
- **Type:** Experimental/Testbed
- **Status:** Active Development
- **Initial Commit:** November 14, 2025

---

## Current State

### Directory Structure

```
claude-testbed1/
├── .git/              # Git version control
├── README.md          # Basic repository description
└── CLAUDE.md          # This file - AI assistant guide
```

### Technology Stack

**Current:** None (empty repository)

**Potential Future Stack:**
- To be determined based on experimental needs
- May include multiple languages and frameworks
- Expected to evolve based on testing requirements

### Dependencies

**Current:** None

**Management:**
- Dependencies should be documented when added
- Use standard package managers for respective languages
- Keep dependency documentation updated

---

## Development Workflow

### Branch Naming Convention

This repository uses a specific branch naming pattern for AI-assisted development:

```
claude/claude-md-<session-id>-<unique-identifier>
```

**Example:**
```
claude/claude-md-mhzlkop2h6bc3ul3-015tPLTh5wWASNFb9GRMt8ck
```

**Important Rules:**
- All development branches MUST start with `claude/`
- Branch names MUST end with the matching session ID
- Pushes to incorrectly named branches will fail with 403 error
- Never modify the branch name format

### Git Operations

#### Pushing Changes

```bash
# Always use -u flag for first push
git push -u origin <branch-name>

# Retry logic for network failures
# Retry up to 4 times with exponential backoff: 2s, 4s, 8s, 16s
```

#### Fetching/Pulling

```bash
# Prefer specific branch fetches
git fetch origin <branch-name>

# For pulls
git pull origin <branch-name>

# Apply same retry logic for network failures
```

#### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(api): add user authentication endpoint

docs(readme): update installation instructions

fix(parser): resolve edge case in JSON parsing
```

---

## Git Branching Strategy

### Main Branch

**Branch:** `main` (or `master`)
- Protected branch
- Represents stable state
- Used as base for pull requests

### Feature Branches

**Pattern:** `claude/claude-md-*`
- Created for each development session
- Should be focused on specific tasks
- Merged via pull request after completion

### Workflow

1. **Start:** Branch created automatically by Claude Code
2. **Develop:** Make changes on feature branch
3. **Commit:** Regular commits with clear messages
4. **Push:** Push to origin with `-u` flag
5. **Review:** Create pull request when ready
6. **Merge:** Merge to main after review

---

## Code Conventions

### General Principles

Since this is a testbed repository, establish conventions as code is added:

1. **Consistency:** Follow language-specific style guides
2. **Documentation:** Comment complex logic
3. **Testing:** Add tests for new functionality
4. **Security:** Avoid hardcoded credentials
5. **Modularity:** Keep code organized and modular

### File Organization

As the project grows, organize by:
- **Feature:** Group related files together
- **Type:** Separate source, tests, docs, configs
- **Layer:** Distinguish between API, logic, data layers

### Naming Conventions

**Files:**
- Use lowercase with hyphens: `user-service.js`
- Or camelCase/snake_case per language convention

**Functions/Methods:**
- Use descriptive, verb-based names
- Follow language conventions (camelCase for JS, snake_case for Python)

**Variables:**
- Use descriptive names
- Avoid single-letter names except in loops
- Use constants for magic numbers

---

## AI Assistant Guidelines

### Core Principles

1. **Understand Before Acting**
   - Read existing code before making changes
   - Understand the context and purpose
   - Ask for clarification when needed

2. **Preserve Intent**
   - Maintain existing patterns and conventions
   - Don't introduce breaking changes without discussion
   - Respect the codebase architecture

3. **Document Changes**
   - Commit messages should explain "why" not just "what"
   - Update documentation when changing behavior
   - Add comments for complex logic

4. **Security First**
   - Never commit secrets or credentials
   - Avoid common vulnerabilities (XSS, SQL injection, etc.)
   - Validate and sanitize inputs
   - Follow OWASP best practices

### Task Management

**Use TodoWrite tool for:**
- Multi-step tasks (3+ steps)
- Complex implementations
- Tasks with dependencies
- User-requested task lists

**Todo States:**
- `pending`: Not started
- `in_progress`: Currently working (only ONE at a time)
- `completed`: Finished successfully

**Task Completion:**
- Only mark completed when fully done
- Keep in_progress if encountering errors
- Create new task for blockers
- Update status in real-time

### Tool Usage

**Preferred Tools:**
- `Read`: For reading files (not `cat`)
- `Edit`: For modifying files (not `sed/awk`)
- `Write`: For new files (not `echo >`)
- `Grep`: For searching content (not `grep` command)
- `Glob`: For finding files (not `find`)
- `Task`: For complex multi-step operations

**Bash Tool:**
- Use for actual terminal operations
- Git commands
- Package managers (npm, pip, etc.)
- Running tests and builds
- NOT for file operations or communication

### Communication

**Do:**
- Be concise and clear
- Use markdown for formatting
- Include file paths with line numbers: `file.js:42`
- Explain complex decisions
- Ask questions when uncertain

**Don't:**
- Use emojis (unless requested)
- Create unnecessary documentation files
- Be overly verbose
- Use superlatives or excessive praise
- Use bash echo to communicate

---

## Common Tasks

### Starting New Development

```bash
# Ensure you're on the correct branch
git status

# Verify branch name matches pattern
# claude/claude-md-<session-id>-<unique-id>

# Start development
# Use TodoWrite to plan multi-step tasks
```

### Adding Dependencies

**Node.js:**
```bash
npm install <package>
# or
yarn add <package>
```

**Python:**
```bash
pip install <package>
# Update requirements.txt
pip freeze > requirements.txt
```

**Document in CLAUDE.md when adding major dependencies**

### Running Tests

When tests are added:
```bash
# Node.js
npm test

# Python
pytest

# Document test commands as they're added
```

### Creating Pull Requests

```bash
# 1. Commit all changes
git add .
git commit -m "feat: descriptive message"

# 2. Push to origin
git push -u origin <branch-name>

# 3. Create PR using gh CLI (if available) or GitHub UI
gh pr create --title "Title" --body "Description"
```

---

## Future Development

### Potential Additions

As the repository evolves, consider adding:

1. **CI/CD Pipeline**
   - GitHub Actions workflows
   - Automated testing
   - Code quality checks
   - Automated deployments

2. **Code Quality Tools**
   - Linters (ESLint, Pylint, etc.)
   - Formatters (Prettier, Black, etc.)
   - Type checkers (TypeScript, mypy, etc.)
   - Pre-commit hooks

3. **Testing Infrastructure**
   - Unit tests
   - Integration tests
   - End-to-end tests
   - Test coverage reporting

4. **Documentation**
   - API documentation
   - Architecture diagrams
   - Developer guides
   - Changelog

5. **Development Tools**
   - Docker configuration
   - Development environment setup
   - Database migrations
   - Seed data

### Updating This Document

**When to Update:**
- Major architectural changes
- New conventions established
- Technology stack changes
- New development workflows
- Important patterns emerge

**How to Update:**
- Keep the structure consistent
- Add new sections as needed
- Update "Last Updated" date
- Document breaking changes
- Preserve historical context where relevant

---

## Notes for AI Assistants

### Quick Reference

**Before Starting:**
- [ ] Read CLAUDE.md (this file)
- [ ] Check current branch matches pattern
- [ ] Understand the task requirements
- [ ] Plan multi-step tasks with TodoWrite

**During Development:**
- [ ] Use appropriate tools (Read, Edit, Write)
- [ ] Follow git conventions
- [ ] Update todos in real-time
- [ ] Test changes when possible
- [ ] Commit with clear messages

**Before Finishing:**
- [ ] Ensure all todos completed
- [ ] Run tests if applicable
- [ ] Commit all changes
- [ ] Push to correct branch
- [ ] Verify clean git status

### Common Pitfalls to Avoid

1. **Git Errors**
   - Pushing to wrong branch name (must start with `claude/`)
   - Not using `-u` flag on first push
   - Not handling network retry logic

2. **Code Quality**
   - Introducing security vulnerabilities
   - Breaking existing functionality
   - Inconsistent code style
   - Missing documentation

3. **Task Management**
   - Forgetting to mark todos as completed
   - Having multiple todos in_progress
   - Not breaking down complex tasks
   - Skipping todo planning for multi-step tasks

4. **Tool Usage**
   - Using bash for file operations
   - Not reading files before editing
   - Creating unnecessary new files
   - Using grep command instead of Grep tool

---

## Contact & Support

For issues or questions about this repository:
- Create an issue in the GitHub repository
- Contact: abilash-ravikumar

For Claude Code assistance:
- Documentation: https://docs.claude.com/
- Report issues: https://github.com/anthropics/claude-code/issues

---

**End of CLAUDE.md**
