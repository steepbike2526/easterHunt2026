export const ROUTES = {
  INTRO: 'init',
  ASSESSMENT: 'asmt',
  CLUE_ONE: 'clu1',
  FRACTION_ASSESSMENT: 'frac',
  ROCKET_PUZZLE: 'rckt',
  FINAL_CHALLENGE: 'finl'
}

export const getRoutePath = (id) => `/${id}`

export const normalizeClueCode = (value) => value.trim().toLowerCase()

export const getRoutePathFromClueCode = (value) => {
  const normalizedCode = normalizeClueCode(value)

  if (!Object.values(ROUTES).includes(normalizedCode)) {
    return null
  }

  return getRoutePath(normalizedCode)
}
