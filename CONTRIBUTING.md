# Contributing

## Adding a deal

1. Fork the repo.
2. Copy an existing file from `deals/` as a template.
3. Rename to `<your-deal-id>.yml` (kebab-case, e.g., `nvda-openai-gpu`).
4. Fill in the fields. All fields listed below are required unless marked optional.

````yaml
id: your-deal-id                  # must match filename
source_slug: nvidia               # must exist in companies.yml
source_name: NVIDIA               # must match companies.yml record
target_slug: coreweave
target_name: CoreWeave
deal_type: cloud_capacity         # gpu_purchase | custom_asic | equity_investment | cloud_capacity | m_and_a | funding_round
value_billions: 6.3               # optional; null if undisclosed
value_display: "$6.3B"            # optional; human-readable
date: "2025-09"                   # YYYY-MM or YYYY-MM-DD
date_display: "Sep 2025"
description: >
  One-sentence summary of the deal.
source_url: https://...           # primary source; must be https
````

5. Run `npm run validate` locally to confirm.
6. Open a PR. CI will re-run validation.

## Adding a new company

Edit `companies.yml` directly. Follow the existing structure. The slug must be unique and kebab-case.

## Running locally

```bash
npm install
npm run validate       # schema + integrity checks
npm test               # unit tests for scripts
npm run build          # emit dist/
```

## Sourcing standards

- Prefer press releases, SEC filings (8-K, S-1), or major outlets (Reuters, Bloomberg, WSJ, FT, NYT).
- Blog posts from the companies themselves are acceptable.
- Opinion / rumor pieces are not.
