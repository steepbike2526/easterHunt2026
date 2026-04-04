import { useEffect, useState } from 'react'
import { STREAMING_TEXT_CHARACTER_DELAY_MS } from '../config/streamingText'

export default function StreamingText({
  text,
  as: Component = 'p',
  className = '',
  characterDelayMs = STREAMING_TEXT_CHARACTER_DELAY_MS,
  ...props
}) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)

    if (!text) {
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
  }, [characterDelayMs, text])

  return (
    <Component className={className} {...props}>
      {text.slice(0, visibleCount)}
    </Component>
  )
}
