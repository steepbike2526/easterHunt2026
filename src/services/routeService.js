export const ROUTES = {
  INTRO: 'ruready',
  ASSESSMENT: 'asmt',
  CLUE_ONE: 'clu1',
  FRACTION_ASSESSMENT: 'frame',
  ROCKET_PUZZLE: 'lego',
  FINAL_CHALLENGE: 'bed',
  STANLEY: 'stanley'
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
