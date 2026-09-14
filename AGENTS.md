# Bingo Agent Notes

Follow the canonical project workflow in `/home/cj/cj-os/resources/ai-project-rules.md`.

Project memory lives in `/home/cj/cj-os/projects/bingo/`.

Development defaults:

- Project slug: `bingo`
- Dev port: `4497`
- Remote dev URL: `http://100.75.28.101:4497`
- Deployment target: Docker/Coolify on x-os
- Public URL: `https://bingo.cjv.app` (legacy `https://bingo.x-os.sh` 301-redirects to the canonical host while `x-os.sh` retires)
- Data mode: generated local-only print layouts, no persistent user data

Do not deploy, restart Coolify services, push watched branches, or change live environment variables without explicit CJ approval.
