import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const GRID_SIZE = 20
const WIN_SCORE = 100
const MIN_SWIPE_DISTANCE = 24
const SPECIAL_EGG_NUMBER = 34

const pastelColors = ['bg-pink-200', 'bg-purple-200', 'bg-yellow-200', 'bg-cyan-200', 'bg-emerald-200']
const accentColors = ['bg-pink-500', 'bg-purple-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-emerald-500']
const patterns = ['dots', 'stripes', 'band']

const createInitialSnake = () => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
]

const randomEggStyle = () => ({
  shell: pastelColors[Math.floor(Math.random() * pastelColors.length)],
  accent: accentColors[Math.floor(Math.random() * accentColors.length)],
  pattern: patterns[Math.floor(Math.random() * patterns.length)]
})

const isOppositeDirection = (next, current) => next.x + current.x === 0 && next.y + current.y === 0

const pointsForEgg = (eggNumber) => {
  if (eggNumber <= 10) return 1
  if (eggNumber <= 20) return 2
  if (eggNumber <= 30) return 4
  return 8
}

const speedForEggCount = (eggCount) => {
  if (eggCount >= 30) return 95
  if (eggCount >= 20) return 120
  if (eggCount >= 10) return 145
  return 170
}

const snakeColorForEggCount = (eggCount) => {
  if (eggCount >= 30) return 'bg-rose-500'
  if (eggCount >= 20) return 'bg-rose-400'
  if (eggCount >= 10) return 'bg-yellow-300'
  return 'bg-lime-300'
}

const getEggCells = (food) => {
  const size = food.size ?? 1
  const cells = []

  for (let offsetY = 0; offsetY < size; offsetY += 1) {
    for (let offsetX = 0; offsetX < size; offsetX += 1) {
      cells.push({ x: food.x + offsetX, y: food.y + offsetY })
    }
  }

  return cells
}

const getRandomFood = (snake, eggNumber) => {
  const isSpecialEgg = eggNumber === SPECIAL_EGG_NUMBER
  const eggSize = isSpecialEgg ? 2 : 1

  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * (GRID_SIZE - eggSize + 1)),
      y: Math.floor(Math.random() * (GRID_SIZE - eggSize + 1)),
      size: eggSize,
      isSpecial: isSpecialEgg
    }

    const candidateCells = getEggCells(candidate)
    const isOnSnake = candidateCells.some((cell) => snake.some((segment) => segment.x === cell.x && segment.y === cell.y))
    if (!isOnSnake) {
      return candidate
    }
  }
}

const isTypingTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable
}

const createAudioController = () => {
  if (typeof window === 'undefined') return null

  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null

  const context = new AudioContextClass()

  const playTone = (frequency, duration, startAt, type = 'sine', gainValue = 0.06) => {
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, startAt)
    gainNode.gain.setValueAtTime(0.0001, startAt)
    gainNode.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.015)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + duration)
  }

  return {
    resume: () => {
      if (context.state === 'suspended') {
        void context.resume()
      }
    },
    playEggSound: () => {
      const startAt = context.currentTime + 0.01
      playTone(660, 0.09, startAt, 'triangle', 0.045)
      playTone(880, 0.12, startAt + 0.045, 'triangle', 0.04)
    },
    playWinSound: () => {
      const startAt = context.currentTime + 0.01
      playTone(261.63, 0.5, startAt, 'sine', 0.03)
      playTone(392, 0.32, startAt + 0.05, 'triangle', 0.05)
      playTone(523.25, 0.32, startAt + 0.18, 'triangle', 0.055)
      playTone(659.25, 0.4, startAt + 0.34, 'triangle', 0.06)
      playTone(783.99, 0.45, startAt + 0.54, 'sine', 0.065)
      playTone(1046.5, 0.65, startAt + 0.78, 'sine', 0.07)
      playTone(1318.51, 0.65, startAt + 0.78, 'triangle', 0.05)
      playTone(1567.98, 0.7, startAt + 1.04, 'triangle', 0.05)
    },
    playCrashSound: () => {
      const startAt = context.currentTime + 0.01
      playTone(220, 0.12, startAt, 'square', 0.055)
      playTone(160, 0.16, startAt + 0.08, 'sawtooth', 0.05)
      playTone(110, 0.22, startAt + 0.18, 'sawtooth', 0.055)
      playTone(82.41, 0.28, startAt + 0.28, 'triangle', 0.05)
    },
    dispose: () => {
      void context.close()
    }
  }
}

const createInitialGameState = () => {
  const initialSnake = createInitialSnake()
  return {
    snake: initialSnake,
    direction: { x: 1, y: 0 },
    pendingDirection: { x: 1, y: 0 },
    food: getRandomFood(initialSnake, 1),
    eggStyle: randomEggStyle(),
    score: 0,
    eggsEaten: 0,
    hasStarted: false,
    isWon: false,
    crashCount: 0
  }
}

function EggSprite({ style, isSpecial, className = '' }) {
  if (isSpecial) {
    return (
      <div className={`relative animate-pulse rounded-[999px] border border-yellow-200 bg-yellow-400 shadow-[0_0_18px_4px_rgba(250,204,21,0.8)] ${className}`}>
        <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-yellow-100" />
        <span className="absolute right-1 top-2 h-1.5 w-1.5 rounded-full bg-amber-200" />
        <span className="absolute left-2 top-4 h-0.5 w-2 rounded-full bg-yellow-100" />
      </div>
    )
  }

  return (
    <div className={`relative h-4 w-3 rounded-[999px] ${style.shell}`}>
      {style.pattern === 'dots' && (
        <>
          <span className={`absolute left-0.5 top-1 h-1 w-1 rounded-full ${style.accent}`} />
          <span className={`absolute right-0.5 top-2 h-1 w-1 rounded-full ${style.accent}`} />
        </>
      )}
      {style.pattern === 'stripes' && (
        <>
          <span className={`absolute left-0 top-1 h-0.5 w-full ${style.accent}`} />
          <span className={`absolute left-0 top-2 h-0.5 w-full ${style.accent}`} />
        </>
      )}
      {style.pattern === 'band' && <span className={`absolute left-1 top-0 h-full w-1 rounded-full ${style.accent}`} />}
    </div>
  )
}

export default function SnakeEasterChallenge({ onWin }) {
  const [gameState, setGameState] = useState(createInitialGameState)
  const [touchStart, setTouchStart] = useState(null)
  const audioControllerRef = useRef(null)
  const previousEggCountRef = useRef(0)
  const previousWonRef = useRef(false)
  const previousCrashCountRef = useRef(0)

  const { snake, food, eggStyle, score, eggsEaten, hasStarted, isWon, crashCount } = gameState

  const tickMs = useMemo(() => speedForEggCount(eggsEaten), [eggsEaten])
  const snakeColorClass = useMemo(() => snakeColorForEggCount(eggsEaten), [eggsEaten])
  const foodCells = useMemo(() => getEggCells(food), [food])

  const ensureAudioReady = useCallback(() => {
    if (!audioControllerRef.current) {
      audioControllerRef.current = createAudioController()
    }
    audioControllerRef.current?.resume()
  }, [])

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState())
  }, [])

  const changeDirection = useCallback((nextDirection, options = {}) => {
    const { startIfStopped = false } = options

    setGameState((prev) => {
      if (prev.isWon) return prev

      const nextPendingDirection = isOppositeDirection(nextDirection, prev.direction)
        ? prev.pendingDirection
        : nextDirection

      return {
        ...prev,
        pendingDirection: nextPendingDirection,
        hasStarted: startIfStopped ? true : prev.hasStarted
      }
    })
  }, [])

  useEffect(() => {
    if (!hasStarted || isWon) {
      return undefined
    }

    const timer = setInterval(() => {
      setGameState((prev) => {
        const head = prev.snake[0]
        const nextHead = { x: head.x + prev.pendingDirection.x, y: head.y + prev.pendingDirection.y }
        const foodCells = getEggCells(prev.food)
        const ateEgg = foodCells.some((cell) => nextHead.x === cell.x && nextHead.y === cell.y)

        const hitWall = nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE
        const occupiedSegments = ateEgg ? prev.snake : prev.snake.slice(0, -1)
        const hitSelf = occupiedSegments.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)

        if (hitWall || hitSelf) {
          return { ...createInitialGameState(), crashCount: prev.crashCount + 1 }
        }

        const nextSnake = [nextHead, ...prev.snake]

        if (!ateEgg) {
          nextSnake.pop()
          return { ...prev, snake: nextSnake, direction: prev.pendingDirection }
        }

        const newEggCount = prev.eggsEaten + 1
        const earnedPoints = pointsForEgg(newEggCount)
        const newScore = prev.score + earnedPoints

        return {
          ...prev,
          snake: nextSnake,
          direction: prev.pendingDirection,
          food: getRandomFood(nextSnake, newEggCount + 1),
          eggStyle: randomEggStyle(),
          score: newScore,
          eggsEaten: newEggCount,
          hasStarted: newScore >= WIN_SCORE ? false : prev.hasStarted,
          isWon: newScore >= WIN_SCORE
        }
      })
    }, tickMs)

    return () => clearInterval(timer)
  }, [hasStarted, isWon, tickMs])

  useEffect(() => {
    if (!isWon) return
    onWin?.()
  }, [isWon, onWin])

  useEffect(() => () => {
    audioControllerRef.current?.dispose()
    audioControllerRef.current = null
  }, [])

  useEffect(() => {
    if (eggsEaten > previousEggCountRef.current) {
      audioControllerRef.current?.playEggSound()
    }

    if (!previousWonRef.current && isWon) {
      audioControllerRef.current?.playWinSound()
    }

    if (crashCount > previousCrashCountRef.current) {
      audioControllerRef.current?.playCrashSound()
    }

    previousEggCountRef.current = eggsEaten
    previousWonRef.current = isWon
    previousCrashCountRef.current = crashCount
  }, [crashCount, eggsEaten, isWon])

  const onTouchStart = (event) => {
    ensureAudioReady()
    const touch = event.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const onTouchEnd = (event) => {
    if (!touchStart) return
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    setTouchStart(null)

    if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE && Math.abs(deltaY) < MIN_SWIPE_DISTANCE) {
      return
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      changeDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 }, { startIfStopped: true })
    } else {
      changeDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 }, { startIfStopped: true })
    }
  }

  useEffect(() => {
    const directionByKey = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }
    }

    const onKeyDown = (event) => {
      const nextDirection = directionByKey[event.key]
      if (!nextDirection) return
      if (isTypingTarget(event.target)) return

      event.preventDefault()
      ensureAudioReady()
      changeDirection(nextDirection, { startIfStopped: true })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [changeDirection, ensureAudioReady])

  return (
    <div className="mt-6 space-y-4 rounded border border-lime-400/40 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-lime-100 md:text-base">
        <p>Score: <span className="font-bold">{score}</span> / {WIN_SCORE}</p>
        <p>Eggs: <span className="font-bold">{eggsEaten}</span></p>
        <p>Next Egg Value: <span className="font-bold">{pointsForEgg(eggsEaten + 1)}</span></p>
      </div>

      <div className="relative">
        <div
          className="mx-auto grid max-w-[420px] touch-none rounded border border-lime-400/40 bg-black"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y)
            const isFood = foodCells.some((cell) => cell.x === x && cell.y === y)
            const isFoodOrigin = food.x === x && food.y === y

            return (
              <div key={`${x}-${y}`} className="relative flex aspect-square items-center justify-center border border-lime-950/20">
                {isSnake && <div className={`h-[70%] w-[70%] rounded-sm ${snakeColorClass}`} />}
                {isFood && !food.isSpecial && <EggSprite style={eggStyle} />}
                {isFood && food.isSpecial && (
                  isFoodOrigin
                    ? (
                      <div className="pointer-events-none absolute inset-0 z-10 h-[200%] w-[200%]">
                        <EggSprite style={eggStyle} isSpecial className="h-full w-full" />
                      </div>
                    )
                    : null
                )}
              </div>
            )
          })}
        </div>

        {isWon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <p className="text-center text-3xl font-black tracking-widest text-yellow-200 md:text-5xl">YOU WON!!!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-lime-200 md:max-w-72">
        <button
          type="button"
          onClick={() => {
            ensureAudioReady()
            setGameState((prev) => ({ ...prev, hasStarted: !prev.hasStarted }))
          }}
          className="rounded border border-lime-300 bg-lime-900/40 px-3 py-2 font-semibold"
        >
          {hasStarted ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={resetGame} className="rounded border border-yellow-400 px-3 py-2 text-yellow-200">Reset</button>
      </div>
      <p className="text-xs text-lime-200/80">
        Use your keyboard arrow keys or swipe the board with one finger to steer the snake.
      </p>
    </div>
  )
}
