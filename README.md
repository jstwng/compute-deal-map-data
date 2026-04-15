# compute-deal-map-data

A source-backed, structured dataset of publicly disclosed AI infrastructure deals: GPU purchases, custom ASIC contracts, equity investments, cloud-capacity agreements, M&A, and funding rounds. Powers the visualization at [justinwang.xyz](https://jstwng.com).

## Using the data

The canonical artifacts are attached to every [Release](../../releases):

- `deals.json` — array of directed deal edges
- `companies.json` — array of company nodes
- `schema.json` — JSON Schema for both

Always-latest download URLs:

```
https://github.com/jstwng/compute-deal-map-data/releases/latest/download/deals.json
https://github.com/jstwng/compute-deal-map-data/releases/latest/download/companies.json
```

Pin to a specific release by replacing `latest` with the tag (e.g., `2026.04.15`).

## Data model

A **company** is a node with a stable `slug` (kebab-case ID), `name`, `ticker`, `category`, and `subline`.

A **deal** is a directed edge from `source_slug` → `target_slug`, typed (GPU purchase, cloud capacity, equity investment, etc.), dated, valued, and linked to a primary source URL. Direction represents the flow of money / chips / equity.

See [`schema/`](schema/) for the full contract.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Every deal must include a primary source URL (press release, SEC filing, or major news outlet). Opinion pieces and unsourced rumors are rejected.

## Repo layout

- `companies.yml` — all companies (one file)
- `deals/<id>.yml` — one file per deal
- `schema/` — JSON Schemas
- `scripts/` — validate + build
- `.github/workflows/` — CI (validate on PR, release on merge to main)

## License

Data is licensed under [CC BY 4.0](LICENSE). Scripts and schemas are MIT.
