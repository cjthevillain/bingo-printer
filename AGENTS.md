# Bingo Agent Notes

Follow the canonical project workflow in `/home/cj/cj-os/resources/ai-project-rules.md`.
Start non-trivial work with `python3 /home/cj/cj-os/scripts/cj_workon.py bingo --compact`.

Project memory lives in `/home/cj/cj-os/projects/bingo/`.

## Workspace Rule

Bingo uses the hybrid workflow. Author and review code in WSL2 at
`/home/cj_thevillain/code/Bingo`
(`\\wsl$\Ubuntu-24.04\home\cj_thevillain\code\Bingo` from Windows). Do not
turn old exports, screenshots, or generated print files into live working
trees.

Use `/home/cj/projects/Bingo` on `x-os` only for deliberate remote integration
checks, deployment work, and post-deploy evidence; it is not the default manual
preview checkout. When switching machines, commit and push only after CJ
explicitly approves those actions.

## Issue Rule

Use GitHub Issues as CJ's short work queue. One issue means one outcome. Keep
the issue focused on the desired result, the current problem, and what "done"
means; the AI should inspect the repository and `cj-os` for technical context
instead of asking CJ to duplicate long notes. Use one Codex task per issue and,
when a new branch is needed, include the issue number in its name. GitHub
publishing, pull requests, merges, deployments, and live changes still require
CJ's explicit approval.

Development defaults:

- Project slug: `bingo`
- Dev port: `4497`
- `npm run dev:remote` binds to `0.0.0.0` on port `4497`.
- WSL2 dev URL from Windows: `http://localhost:4497`
- Explicit x-os dev URL: `http://100.75.28.101:4497`
- Deployment target: Docker/Coolify on x-os
- Public URL: `https://bingo.x-os.sh`
- Data mode: generated local-only print layouts, no persistent user data
- Local runtime: Node `20.19.5`

Do not deploy, restart Coolify services, push watched branches, or change live environment variables without explicit CJ approval.
