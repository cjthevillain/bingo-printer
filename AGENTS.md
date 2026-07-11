# Bingo Agent Notes

Follow the canonical project workflow in `/home/cj/cj-os/resources/ai-project-rules.md`.
Start non-trivial work with `python3 /home/cj/cj-os/scripts/cj_workon.py bingo --compact`.

Project memory lives in `/home/cj/cj-os/projects/bingo/`.

## Workspace Rule

Bingo uses the hybrid workflow. Author code from a fresh local Git clone and
synchronize task branches through GitHub. The preferred Windows checkout is
`C:\Users\cj_thevillain\Documents\BingoPrinter`; do not turn old exports,
screenshots, or generated print files into live working trees.

Use `/home/cj/projects/Bingo` for Linux integration, previews, and deployment
work. Before switching machines, commit and push the current task branch, then
start the other machine from that pushed branch.

Development defaults:

- Project slug: `bingo`
- Dev port: `4497`
- Remote dev URL: `http://100.75.28.101:4497`
- Deployment target: Docker/Coolify on x-os
- Public URL: `https://bingo.x-os.sh`
- Data mode: generated local-only print layouts, no persistent user data

Do not deploy, restart Coolify services, push watched branches, or change live environment variables without explicit CJ approval.
