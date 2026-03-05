# Deployment Guide

## Prerequisites

- Railway account (or similar PaaS)
- Redis instance
- GitHub Personal Access Token with `repo` scope

## Environment Variables

```bash
# GitHub
GH_TOKEN=ghp_xxxxxxxxxxxx          # PAT with repo scope
OCTO_COMMITTER_NAME=martinbaud
OCTO_COMMITTER_EMAIL=martinbaud.git@gmail.com

# App
APP_PROTOCOL=https
APP_DOMAIN=railway.app              # or custom domain
APP_SUB_DOMAIN=dynamic-readme
APP_PORT=3000

# Redis
REDIS_URL=redis://default:xxx@xxx.railway.app:6379

# JWT (generate random)
JWT_SECRET=xxxxxxxxxxxxxxxx
```

## Railway Setup

1. Create new project
2. Add Redis service
3. Add Node.js service from GitHub repo
4. Set environment variables
5. Deploy

## Config

Copy `config.martinbaud.json` to `config.json` and adjust.

## Sprites

### Option 1: Emojis (current)
No setup needed. Uses Unicode emojis.

### Option 2: Vanilla-style sprites
Download 16x16 textures to `src/assets/minecraft/`:

```
oak_log.png
oak_planks.png
stick.png
wooden_pickaxe.png
crafting_table.png
chest.png
empty.png
```

Sources (check licenses):
- [Faithful Pack](https://faithfulpack.net/) - CC BY-NC-SA
- Custom pixel art (recommended)

### Option 3: Generate SVG
Create simple SVG icons matching the emoji style.

## Testing

```bash
npm run dev
# Visit http://localhost:3000/minecraft/martinbaud-craft/reset
```

## Post-deploy

1. Update profile README to point to deployed service
2. Test crafting flow
3. Monitor Redis memory usage
