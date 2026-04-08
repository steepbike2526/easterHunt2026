import { useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { STREAMING_TEXT_CHARACTER_DELAY_MS } from '../config/streamingText'
import { StreamingTextSequenceContext } from './StreamingTextSequenceContext'

export default function StreamingText({
  text,
  as: Component = 'p',
  className = '',
  characterDelayMs = STREAMING_TEXT_CHARACTER_DELAY_MS,
  onComplete,
  ...props
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const streamId = useId()
  const hasNotifiedCompletionRef = useRef(false)
  const sequenceContext = useContext(StreamingTextSequenceContext)

  const isSequenced = Boolean(sequenceContext)
  const register = sequenceContext?.register
  const unregister = sequenceContext?.unregister
  const markComplete = sequenceContext?.markComplete
  const activeId = sequenceContext?.activeId
  const completedIds = sequenceContext?.completedIds ?? []

  const hasCompleted = useMemo(() => completedIds.includes(streamId), [completedIds, streamId])
  const canAnimate = !isSequenced || hasCompleted || activeId === streamId

  useEffect(() => {
    if (!register || !unregister) {
      return undefined
    }

    register(streamId)

    return () => {
      unregister(streamId)
    }
  }, [register, streamId, unregister])

  useEffect(() => {
    setVisibleCount(0)
    hasNotifiedCompletionRef.current = false
  }, [text])

  useEffect(() => {
    if (!text) {
      if (isSequenced && canAnimate) {
        markComplete?.(streamId)
      }

      return undefined
    }

    if (!canAnimate || hasCompleted) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setVisibleCount((previousCount) => {
        if (previousCount >= text.length) {
          window.clearInterval(intervalId)
          return previousCount
        }

        return previousCount + 1
      })
    }, characterDelayMs)

    return () => window.clearInterval(intervalId)
  }, [canAnimate, characterDelayMs, hasCompleted, isSequenced, markComplete, streamId, text])

  useEffect(() => {
    if (!isSequenced || !canAnimate || !text || hasCompleted) {
      return
    }

    if (visibleCount >= text.length) {
      markComplete?.(streamId)
    }
  }, [canAnimate, hasCompleted, isSequenced, markComplete, streamId, text, visibleCount])

  useEffect(() => {
    if (!onComplete) {
      return
    }

    if (hasNotifiedCompletionRef.current) {
      return
    }

    if (!text || hasCompleted || visibleCount >= text.length) {
      hasNotifiedCompletionRef.current = true
      onComplete()
    }
  }, [hasCompleted, onComplete, text, visibleCount])

  const displayText = hasCompleted ? text : text.slice(0, visibleCount)

  return (
    <Component className={className} {...props}>
      {displayText}
    </Component>
  )
}
