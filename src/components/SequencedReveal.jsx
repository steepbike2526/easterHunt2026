import { useContext, useEffect, useId, useMemo } from 'react'
import { StreamingTextSequenceContext } from './StreamingTextSequenceContext'

export default function SequencedReveal({ children }) {
  const revealId = useId()
  const sequenceContext = useContext(StreamingTextSequenceContext)

  const isSequenced = Boolean(sequenceContext)
  const register = sequenceContext?.register
  const unregister = sequenceContext?.unregister
  const markComplete = sequenceContext?.markComplete
  const activeId = sequenceContext?.activeId
  const completedIds = sequenceContext?.completedIds ?? []

  const hasCompleted = useMemo(() => completedIds.includes(revealId), [completedIds, revealId])
  const canReveal = !isSequenced || hasCompleted || activeId === revealId

  useEffect(() => {
    if (!isSequenced || !register || !unregister) {
      return undefined
    }

    register(revealId)

    return () => {
      unregister(revealId)
    }
  }, [isSequenced, register, revealId, unregister])

  useEffect(() => {
    if (isSequenced && canReveal && !hasCompleted) {
      markComplete?.(revealId)
    }
  }, [canReveal, hasCompleted, isSequenced, markComplete, revealId])

  if (!canReveal && !hasCompleted) {
    return null
  }

  return children
}
