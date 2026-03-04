# Minecraft Crafting Table Module

Fork intention: Interactive crafting table for GitHub profile README.

## Goal

Visitors can craft items by clicking on the 3x3 grid. Each craft commits a new README showing the result.

## Architecture

```
src/modules/dynamics/minecraft-crafting.module.ts  <- New module
src/games/minecraft/                               <- Game logic
  ├── Crafting.ts                                  <- Recipes & validation
  ├── recipes.json                                 <- All vanilla recipes
  └── items.ts                                     <- Item definitions
src/assets/minecraft/                              <- 16x16 item sprites
```

## Module Pattern (from minesweeper)

```typescript
export class MinecraftCraftingModule extends AbstractDynamicModule<Data, Options> {
  async init() { /* Load/create crafting state from Redis */ }
  async click(slot: number, item: string) { /* Place item in slot */ }
  async craft() { /* Validate recipe, return result */ }
  async render() { /* Generate HTML grid with <a> links */ }
}
```

## State (Redis)

```json
{
  "uuid": "abc123",
  "grid": [null, null, null, null, null, null, null, null, null],
  "inventory": ["oak_log", "oak_log", "oak_log"],
  "result": null,
  "history": []
}
```

## Recipes

Start with basic recipes:
- Oak Log -> Oak Planks (x4)
- Oak Planks -> Sticks (x4)
- Planks + Sticks -> Wooden Pickaxe
- Cobblestone + Sticks -> Stone Pickaxe

## Dependencies

- Existing: Redis, @napi-rs/canvas, @skyra/gifenc
- New: Minecraft item sprites (from wiki or custom 16x16)

## Deployment

- Railway or similar (NestJS + Redis)
- GitHub token with repo write access
- Config: martinbaud profile repo

## Roadmap

- [x] Create basic module structure
- [x] Implement grid rendering (HTML table with links)
- [x] Add 5 starter recipes (log, planks, sticks, pickaxe, crafting table, chest)
- [ ] Add item sprites (currently using emojis)
- [ ] Deploy and test
- [ ] Integrate into martinbaud profile

---

*Doc-first: Plan before code*
