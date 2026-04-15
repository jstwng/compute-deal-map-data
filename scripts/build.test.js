import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildDataset } from './build.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const validFx = path.join(__dirname, '_fixtures', 'valid')

test('build hydrates source_category and target_category', () => {
  const { deals } = buildDataset(validFx)
  const d = deals[0]
  assert.equal(d.source_category, 'chip_designer')
  assert.equal(d.target_category, 'neocloud')
})

test('build sorts deals by date ascending then id', () => {
  const { deals } = buildDataset(validFx)
  for (let i = 1; i < deals.length; i++) {
    const prev = deals[i - 1]
    const cur = deals[i]
    assert.ok(prev.date < cur.date || (prev.date === cur.date && prev.id <= cur.id))
  }
})

test('build emits companies as-is', () => {
  const { companies } = buildDataset(validFx)
  assert.ok(companies.find(c => c.slug === 'nvidia'))
})
