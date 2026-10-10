# Feature documentation

One file per important feature, **numbered in implementation order** so the build
sequence is obvious at a glance. Each file describes purpose, behavior, files,
contracts, edge cases, and the tests that cover it.

| # | Feature | File | Phase |
| - | ------- | ---- | ----- |
| 01 | Theme system | [01-theme-system.md](./01-theme-system.md) | 0 |
| 02 | 15-band Equalizer | [02-equalizer.md](./02-equalizer.md) | 0 |
| 03 | Player queue | [03-player-queue.md](./03-player-queue.md) | 0 |
| 04 | Player engine | [04-player-engine.md](./04-player-engine.md) | 0 (spike) |
| 05 | Database | [05-database.md](./05-database.md) | 0/1 |
| 06 | Module registry | [06-plugin-registry.md](./06-plugin-registry.md) | 1 |
| 07 | State stores | [07-state-stores.md](./07-state-stores.md) | 1 |
| 08 | Design system | [08-design-system.md](./08-design-system.md) | 1 |
| 09 | Navigation shell | [09-navigation-shell.md](./09-navigation-shell.md) | 1 |
| 10 | Settings | [10-settings.md](./10-settings.md) | 1 |
| 11 | Metadata parsing | [11-metadata-parsing.md](./11-metadata-parsing.md) | 2 |
| 12 | File access & scanning | [12-library-scanning.md](./12-library-scanning.md) | 2 |
| 13 | Folder browsing | [13-folder-browsing.md](./13-folder-browsing.md) | 2 |

**How to number a new feature:** give it the next number after the highest
existing one, and pick a name that describes the capability (not the screen).

When adding a feature, add its file here and update `TESTS.md`.
