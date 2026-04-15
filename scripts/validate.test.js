import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateDataset } from './validate.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fx = (name) => path.join(__dirname, '_fixtures', name)

test('valid dataset passes', () => {
  const errors = validateDataset(fx('valid'))
  assert.deepEqual(errors, [])
})

test('unknown source_slug fails with integrity error', () => {
  const errors = validateDataset(fx('unknown-source-slug'))
  assert.ok(errors.some(e => /unknown source_slug/.test(e)), errors.join('\n'))
})

test('cached source_name mismatch fails', () => {
  const errors = validateDataset(fx('name-mismatch'))
  assert.ok(errors.some(e => /source_name.*does not match/.test(e)), errors.join('\n'))
})

test('duplicate deal id fails', () => {
  const errors = validateDataset(fx('duplicate-id'))
  assert.ok(errors.some(e => /duplicate id/.test(e)), errors.join('\n'))
})

test('filename must match id', () => {
  const errors = validateDataset(fx('filename-mismatch'))
  assert.ok(errors.some(e => /filename.*does not match id/.test(e)), errors.join('\n'))
})

test('invalid date format fails schema', () => {
  const errors = validateDataset(fx('bad-date'))
  assert.ok(errors.some(e => /date/.test(e)), errors.join('\n'))
})

test('non-https source_url fails schema', () => {
  const errors = validateDataset(fx('http-url'))
  assert.ok(errors.some(e => /source_url/.test(e)), errors.join('\n'))
})

test('unknown deal_type fails schema', () => {
  const errors = validateDataset(fx('bad-deal-type'))
  assert.ok(errors.some(e => /deal_type/.test(e)), errors.join('\n'))
})
