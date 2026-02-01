# Leah Schwartz Archive - Bash Commands Cheatsheet

## Initial Setup (Run Once)

```bash
# 1. Unzip the project folder
unzip leah-schwartz-archive.zip
cd leah-schwartz-archive

# 2. Initialize git
git init
git add .
git commit -m "Initial commit: project planning docs"

# 3. Create GitHub repo (if using GitHub CLI)
gh repo create leah-schwartz-archive --private --source=. --push

# Or manually: create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/leah-schwartz-archive.git
git push -u origin main
```

## Starting Claude Code

```bash
# Navigate to project
cd leah-schwartz-archive

# Start Claude Code with dangerous permissions (skips all confirmation prompts)
claude --dangerously-skip-permissions

# Or if you want to be more selective, use:
claude --allowedTools "Bash(npm:*)" "Bash(git:*)" "Bash(cd:*)" "Edit" "Write"
```

## Phase 1: Scaffolding (Single Branch)

```bash
# In your main project folder, start Claude Code:
claude --dangerously-skip-permissions

# Tell Claude:
# "Read CLAUDE.md and docs/PLAN.md. Start Phase 1: scaffold the project with 
# Vite, React, TypeScript, Tailwind, Framer Motion. Set up routing for all 
# main pages. Create placeholder artwork data. Get it running on localhost."

# Once Phase 1 is done and working:
git add .
git commit -m "feat: Phase 1 complete - project scaffolding"
git push origin main
```

## Phase 2+: Using Worktrees for Parallel Development

```bash
# Create worktrees for parallel features (run from main project folder)
# Each worktree is a separate folder with its own branch

# Worktree 1: Home/Entrance Experience
git worktree add ../leah-home feature/home-entrance

# Worktree 2: Timeline (Hero Feature)  
git worktree add ../leah-timeline feature/timeline

# Worktree 3: UI Component Library
git worktree add ../leah-ui feature/ui-components

# Now you have this folder structure:
# ~/projects/
#   ├── leah-schwartz-archive/     (main branch)
#   ├── leah-home/                 (feature/home-entrance branch)
#   ├── leah-timeline/             (feature/timeline branch)
#   └── leah-ui/                   (feature/ui-components branch)
```

## Running Multiple Claude Sessions

```bash
# Terminal 1: Work on home entrance
cd ../leah-home
claude --dangerously-skip-permissions
# Tell Claude: "Read CLAUDE.md. Build the infinite gallery home page 
# with floating artworks and z-axis scroll entrance per PLAN.md Phase 2"

# Terminal 2: Work on timeline
cd ../leah-timeline  
claude --dangerously-skip-permissions
# Tell Claude: "Read CLAUDE.md. Build the timeline carousel with 
# Kodak slide effect per PLAN.md Phase 3"

# Terminal 3: Work on UI components
cd ../leah-ui
claude --dangerously-skip-permissions
# Tell Claude: "Read CLAUDE.md. Build the glassmorphism component 
# library: GlassCard, PillButton, CarouselItem per the design tokens"
```

## Reviewing Work (Staff Engineer Pattern)

```bash
# In a separate terminal, go to any worktree
cd ../leah-timeline

# Start a NEW Claude session as a reviewer
claude --dangerously-skip-permissions

# Tell Claude:
# "You are a staff engineer reviewer. Review all the code in this branch.
# Check for: TypeScript errors, animation performance issues, accessibility 
# problems, deviation from CLAUDE.md rules. Be critical. Create a 
# REVIEW.md with your findings."
```

## Merging Completed Features

```bash
# Go back to main project
cd leah-schwartz-archive

# Merge a completed feature
git merge feature/home-entrance
git push origin main

# Or if you prefer PR workflow:
cd ../leah-home
git push origin feature/home-entrance
# Then create PR on GitHub
```

## Cleaning Up Worktrees

```bash
# When done with a feature branch
cd leah-schwartz-archive
git worktree remove ../leah-home

# List all worktrees
git worktree list
```

## Running the Dev Server

```bash
# In any worktree folder
npm run dev

# This starts Vite on http://localhost:5173 (or next available port)
# Each worktree can run its own dev server on different ports
```

## Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
# Quick Claude Code start
alias cc="claude --dangerously-skip-permissions"

# Quick navigation
alias leah="cd ~/projects/leah-schwartz-archive"
alias leah-home="cd ~/projects/leah-home"
alias leah-timeline="cd ~/projects/leah-timeline"
```

## Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (run in main project folder)
netlify init

# Deploy preview (from any branch)
netlify deploy

# Deploy to production
netlify deploy --prod
```

## Quick Reference

| Task | Command |
|------|---------|
| Start Claude Code | `claude --dangerously-skip-permissions` |
| Create worktree | `git worktree add ../folder-name branch-name` |
| List worktrees | `git worktree list` |
| Remove worktree | `git worktree remove ../folder-name` |
| Run dev server | `npm run dev` |
| Build production | `npm run build` |

---

## Recommended Workflow Summary

1. **Phase 1** → Single Claude session on `main` → Scaffold everything
2. **Commit & push** when Phase 1 works
3. **Create 2-3 worktrees** for parallel Phase 2/3/4 work
4. **Run separate Claude sessions** in each worktree
5. **Use a "reviewer" Claude** to check work before merging
6. **Merge completed features** back to main
7. **Repeat** for remaining phases
