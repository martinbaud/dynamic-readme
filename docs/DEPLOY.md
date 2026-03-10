# Railway deploy

## Env vars

```bash
GH_TOKEN=<github_pat>
OCTO_COMMITTER_NAME=<github_username>
OCTO_COMMITTER_EMAIL=<email>
REDIS_URL=<railway_redis_url>
JWT_SECRET=<random>
APP_PROTOCOL=https
APP_DOMAIN=railway.app
APP_SUB_DOMAIN=dynamic-readme
APP_PORT=3000
```

## Setup

Create Railway project, add Redis, deploy from repo, set env vars above.

Config: copy `config.martinbaud.json` → `config.json`

## Local

```bash
npm run dev
# http://localhost:3000/minecraft/martinbaud-craft/reset
```

## Sprites

Emojis work out of the box. Custom 16x16 PNGs go in `src/assets/minecraft/` if needed.
