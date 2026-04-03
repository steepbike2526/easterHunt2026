export const normalizeAnswer = (value) => value.trim().toLowerCase().replace(/\s+/g, '')

export const isPositiveInteger = (value) => /^\d+$/.test(value.trim())
