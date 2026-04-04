import { useContext, useEffect, useId, useMemo, useState } from 'react'
import { STREAMING_TEXT_CHARACTER_DELAY_MS } from '../config/streamingText'
import { StreamingTextSequenceContext } from './StreamingTextSequenceContext'

export default function StreamingText({
  text,
  as: Component = 'p',
  className = '',
  characterDelayMs = STREAMING_TEXT_CHARACTER_DELAY_MS,
  ...props
}) {
  const [visibleCount, setVisibleCount] = useState(0)
  const textId = useId()
  const sequenceContext = useContext(StreamingTextSequenceContext)

  useEffect(() => {
    if (!sequenceContext) {
      return undefined
    }

    sequenceContext.register(textId)

    return () => {
      sequenceContext.unregister(textId)
    }
  }, [sequenceContext, textId])

  const isComplete = useMemo(() => {
    if (!sequenceContext) {
      return visibleCount >= text.length
    }

    return sequenceContext.completedIds.includes(textId)
  }, [sequenceContext, textId, text.length, visibleCount])

  const isActive = sequenceContext ? sequenceContext.activeId === textId : true

  useEffect(() => {
    if (!text) {
      return undefined
    }

    if (!isActive || isComplete) {
      return undefined
    }

    setVisibleCount(0)

    const intervalId = window.setInterval(() => {
      setVisibleCount((previousCount) => {
        if (previousCount >= text.length) {
          window.clearInterval(intervalId)
          if (sequenceContext) {
            sequenceContext.markComplete(textId)
          }
          return previousCount
        }

        return previousCount + 1
      })
    }, characterDelayMs)

    return () => window.clearInterval(intervalId)
  }, [characterDelayMs, isActive, isComplete, sequenceContext, text, textId])

  const displayedText = isComplete ? text : text.slice(0, visibleCount)

  return (
    <Component className={className} {...props}>
      {displayedText}
    </Component>
  )
}
