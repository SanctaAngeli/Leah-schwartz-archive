# Claude Code Best Practices

> Reference document from Boris (Claude Code creator). Keep these principles in mind. 

Claude Code Tips
Do more in parallel
Spin up 3–5 git worktrees at once, each running its own Claude session in parallel. It’s the single biggest productivity unlock, and the top tip from the team. Personally, I use multiple git checkouts, but most of the Claude Code team prefers worktrees.
Start every complex task in plan mode
Pour your energy into the plan so Claude can 1-shot the implementation.
One person has one Claude write the plan, then they spin up a second Claude to review it as a staff engineer.
Another says the moment something goes sideways, they stop and re-plan.
Invest in your CLAUDE.md
After every correction, end with: “Update your CLAUDE.md so you don’t make that mistake again.”
Claude is eerily good at writing rules for itself.
Ruthlessly edit your CLAUDE.md over time. Keep iterating.
Create your own skills and commit them to git
Reuse across every project.
Tips from the team:
a. If you do something more than once a day, turn it into a skill or command
b. Build a /techdebt slash command and run it at the end of every session to find and kill duplicated code
Claude fixes most bugs by itself
Enable the Slack MCP, then paste a Slack bug thread into Claude and just say “fix.” Zero context switching required.
Or, just say “Go fix the failing CI tests.” Don’t micromanage how.
Point Claude at Docker logs to diagnose issues.
Level up your prompting
a. Challenge Claude. Say “Grill me on these changes and don’t make a PR until I pass your test.” Make Claude be your reviewer. Or, say “Prove to me this works” and have Claude diff behavior between main and your feature branch
b. After a mediocre fix, say: “Knowing everything you know now, scrap this and implement the elegant solution”
c. Write detailed specs and reduce ambiguity before handing work off. The more specific you are, the better the output
Terminal & environment setup
The team loves Ghostty. Multiple people like its synchronized rendering, 24-bit color, and proper unicode support.
For easier Claude-juggling, use /statusline to customize your status bar to always show context usage and current git branch.
Many people color-code and name their terminal tabs, sometimes using tmux — one tab per task/worktree.
Use voice dictation. You speak 3× faster than you type, and your prompts get way more detailed as a result (fn ×2 on macOS).
Use subagents
a. Append “use subagents” to any request where you want Claude to throw more compute at the problem
b. Offload individual tasks to subagents to keep your main agent’s context window clean and focused
c. Route permission requests to Opus 4.5 via a hook — let it scan for attacks and auto-approve the safe ones
Use Claude for data & analytics
Ask Claude Code to use the bq CLI to pull and analyze metrics on the fly.
The team has a BigQuery skill checked into the codebase, and everyone uses it for analytics queries directly in Claude Code.
This works for any database that has a CLI, MCP, or API.
Learning with Claude
a. Enable the “Explanatory” or “Learning” output style in /config to have Claude explain the why behind its changes
b. Have Claude generate a visual HTML presentation explaining unfamiliar code
c. Ask Claude to draw ASCII diagrams of new protocols and codebases
d. Build a spaced-repetition learning skill: you explain your understanding, Claude asks follow-ups to fill gaps, and stores the result

