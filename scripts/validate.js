import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const dealSchema = JSON.parse(
  fs.readFileSync(new URL('../schema/deal.schema.json', import.meta.url), 'utf8')
)
const companySchema = JSON.parse(
  fs.readFileSync(new URL('../schema/company.schema.json', import.meta.url), 'utf8')
)

function makeValidators() {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  return {
    validateDeal: ajv.compile(dealSchema),
    validateCompany: ajv.compile(companySchema),
  }
}

export function validateDataset(root) {
  const errors = []
  const { validateDeal, validateCompany } = makeValidators()

  const companiesPath = path.join(root, 'companies.yml')
  let companies = []
  try {
    companies = yaml.load(fs.readFileSync(companiesPath, 'utf8')) || []
  } catch (e) {
    errors.push(`companies.yml: ${e.message}`)
    return errors
  }

  if (!Array.isArray(companies)) {
    errors.push('companies.yml: root must be a list')
    return errors
  }

  for (const [i, c] of companies.entries()) {
    if (!validateCompany(c)) {
      for (const err of validateCompany.errors) {
        errors.push(`companies.yml[${i}] ${err.instancePath} ${err.message}`)
      }
    }
  }

  const companyBySlug = new Map()
  for (const c of companies) {
    if (c && c.slug) companyBySlug.set(c.slug, c)
  }

  const dealsDir = path.join(root, 'deals')
  const dealFiles = fs.existsSync(dealsDir)
    ? fs.readdirSync(dealsDir).filter(f => f.endsWith('.yml')).sort()
    : []

  const seenIds = new Set()

  for (const file of dealFiles) {
    const full = path.join(dealsDir, file)
    let deal
    try {
      deal = yaml.load(fs.readFileSync(full, 'utf8'))
    } catch (e) {
      errors.push(`${file}: ${e.message}`)
      continue
    }

    if (!validateDeal(deal)) {
      for (const err of validateDeal.errors) {
        errors.push(`${file} ${err.instancePath} ${err.message}`)
      }
      continue
    }

    const expectedFilename = `${deal.id}.yml`
    if (file !== expectedFilename) {
      errors.push(`${file}: filename does not match id (expected ${expectedFilename})`)
    }

    if (seenIds.has(deal.id)) {
      errors.push(`${file}: duplicate id ${deal.id}`)
    }
    seenIds.add(deal.id)

    const src = companyBySlug.get(deal.source_slug)
    if (!src) {
      errors.push(`${file}: unknown source_slug ${deal.source_slug}`)
    } else if (src.name !== deal.source_name) {
      errors.push(`${file}: source_name "${deal.source_name}" does not match companies.yml record "${src.name}"`)
    }

    const tgt = companyBySlug.get(deal.target_slug)
    if (!tgt) {
      errors.push(`${file}: unknown target_slug ${deal.target_slug}`)
    } else if (tgt.name !== deal.target_name) {
      errors.push(`${file}: target_name "${deal.target_name}" does not match companies.yml record "${tgt.name}"`)
    }
  }

  return errors
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] || process.cwd()
  const errors = validateDataset(root)
  if (errors.length) {
    console.error(`Validation failed with ${errors.length} error(s):`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }
  console.log('OK')
}
