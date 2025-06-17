import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

export function buildDataset(root) {
  const companies = yaml.load(
    fs.readFileSync(path.join(root, 'companies.yml'), 'utf8')
  ) || []
  const companyBySlug = new Map(companies.map(c => [c.slug, c]))

  const dealsDir = path.join(root, 'deals')
  const files = fs.readdirSync(dealsDir).filter(f => f.endsWith('.yml')).sort()

  const deals = files.map(f => {
    const d = yaml.load(fs.readFileSync(path.join(dealsDir, f), 'utf8'))
    return {
      ...d,
      source_category: companyBySlug.get(d.source_slug)?.category ?? null,
      target_category: companyBySlug.get(d.target_slug)?.category ?? null,
    }
  })

  deals.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1
    return a.id < b.id ? -1 : 1
  })

  return { companies, deals }
}

export function writeDist(root, outDir) {
  const { companies, deals } = buildDataset(root)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'companies.json'), JSON.stringify(companies, null, 2) + '\n')
  fs.writeFileSync(path.join(outDir, 'deals.json'), JSON.stringify(deals, null, 2) + '\n')

  const dealSchema = JSON.parse(
    fs.readFileSync(new URL('../schema/deal.schema.json', import.meta.url), 'utf8')
  )
  const companySchema = JSON.parse(
    fs.readFileSync(new URL('../schema/company.schema.json', import.meta.url), 'utf8')
  )
  fs.writeFileSync(
    path.join(outDir, 'schema.json'),
    JSON.stringify({ deal: dealSchema, company: companySchema }, null, 2) + '\n'
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd()
  writeDist(root, path.join(root, 'dist'))
  console.log('Built dist/')
}
