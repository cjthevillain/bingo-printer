# Bingo Printer

Printable black-and-white Bingo card generator for letter-size paper.

## Scripts

- `npm run dev` - local Vite dev server.
- `npm run dev:remote` - x-os dev server on port 4497.
- `npm run build` - production static build.
- `npm run preview:remote` - preview the static build on x-os.

## Deployment

Migration target: `https://bingo.cjv.app`

The current deployment remains at `https://bingo.x-os.sh` until the new domain
passes DNS, HTTPS, application and `/health` checks. Keep the old host available
for compatibility, then redirect browser requests directly to the new host while
preserving paths and query strings.

Coolify should use the Dockerfile at `/Dockerfile` and expose port `80`.
