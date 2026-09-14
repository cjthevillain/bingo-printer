# Bingo Printer

Printable black-and-white Bingo card generator for letter-size paper.

## Scripts

- `npm run dev` - local Vite dev server.
- `npm run dev:remote` - x-os dev server on port 4497.
- `npm run build` - production static build.
- `npm run preview:remote` - preview the static build on x-os.

## Deployment

Deployment domain: `https://bingo.cjv.app`

The legacy host `https://bingo.x-os.sh` 301-redirects to the
canonical host, preserving paths and query strings. DNS, HTTPS, application and
`/health` checks have passed on the new host.

Coolify should use the Dockerfile at `/Dockerfile` and expose port `80`.
