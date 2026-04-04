import { createContext, useCallback, useMemo, useState } from 'react'

export const StreamingTextSequenceContext = createContext(null)

export function StreamingTextSequenceProvider({ children }) {
  const [registeredIds, setRegisteredIds] = useState([])
  const [completedIds, setCompletedIds] = useState([])

  const register = useCallback((id) => {
    setRegisteredIds((previousIds) => {
      if (previousIds.includes(id)) {
        return previousIds
      }

      return [...previousIds, id]
    })
  }, [])

  const unregister = useCallback((id) => {
    setRegisteredIds((previousIds) => previousIds.filter((existingId) => existingId !== id))
    setCompletedIds((previousIds) => previousIds.filter((existingId) => existingId !== id))
  }, [])

  const markComplete = useCallback((id) => {
    setCompletedIds((previousIds) => {
      if (previousIds.includes(id)) {
        return previousIds
      }

      return [...previousIds, id]
    })
  }, [])

  const activeId = useMemo(
    () => registeredIds.find((id) => !completedIds.includes(id)) ?? null,
    [completedIds, registeredIds]
  )

  const value = useMemo(
    () => ({ activeId, completedIds, markComplete, register, unregister }),
    [activeId, completedIds, markComplete, register, unregister]
  )

  return <StreamingTextSequenceContext.Provider value={value}>{children}</StreamingTextSequenceContext.Provider>
}
