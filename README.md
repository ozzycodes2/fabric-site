# fabric-site

The site for [Fabric](https://github.com/ozzycodes2/fabric-theme), a color
theme in dusk and dawn: the themes directory, the palette and the port guides.

## Develop

```sh
pnpm install
pnpm dev
```

`pnpm build` writes a static export to `out/`. Tests: `pnpm exec vitest run --coverage`.

## Data

- `data/palette.json` is copied from a `fabric-theme` release tag; never edit
  it by hand.
- `content/ports/*.json` lists the ports, one file per repo.

## License

MIT. See [LICENSE](LICENSE).
