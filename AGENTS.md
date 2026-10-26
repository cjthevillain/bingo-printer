# Bingo Agent Notes

Follow the canonical project workflow in `/home/cj/cj-infra/ai-project-rules.md`.

Project context lives in Basic Memory; search it for this project. The retired CJ OS memory is archived at `/home/cj/_archive/cj-os-retired-20260827/projects/bingo/`.

The canonical authoring checkout is `/home/cj/projects/bingo-printer` on x-os. Former
WSL2 checkouts and archived copies are preservation sources only; do not start
new work from them. Inspect the current x-os branch, worktree, and listeners
before changing branches or starting services.

Development defaults:

- Project slug: `bingo`
- Dev port: `4497`
- Remote dev URL: `http://100.75.28.101:4497`
- Remote development listeners must bind to `0.0.0.0`, never loopback only.
- Deployment target: Docker/Coolify on x-os
- Public URL: `https://bingo.cjv.app` (legacy `https://bingo.x-os.sh` 301-redirects to the canonical host while `x-os.sh` retires)
- Data mode: generated local-only print layouts, no persistent user data

Do not deploy, restart Coolify services, push watched branches, or change live environment variables without explicit CJ approval.
