import { readFileSync } from 'node:fs'

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

export function nowIso() {
  return new Date().toISOString()
}

export function stableId(prefix) {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}

export function normalizeText(value) {
  return String(value ?? '')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}_:/.-]+/gu, ' ')
    .trim()
}

export function tokenize(value) {
  return normalizeText(value).split(/\s+/).filter(Boolean)
}

export function parseJsonLineSafe(line) {
  try {
    return JSON.parse(line)
  } catch {
    return null
  }
}

