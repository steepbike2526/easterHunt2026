import { useCallback, useEffect, useMemo, useState } from 'react'

const GRID_SIZE = 20
const WIN_SCORE = 100
const MIN_SWIPE_DISTANCE = 24

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

const getRandomFood = (snake) => {
  while (true) {
    const candidate = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }

    const isOnSnake = snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y)
    if (!isOnSnake) {
      return candidate
    }
  }
}

function EggSprite({ style }) {
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
  const [snake, setSnake] = useState(createInitialSnake)
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [pendingDirection, setPendingDirection] = useState({ x: 1, y: 0 })
  const [food, setFood] = useState(() => getRandomFood(createInitialSnake()))
  const [eggStyle, setEggStyle] = useState(randomEggStyle)
  const [score, setScore] = useState(0)
  const [eggsEaten, setEggsEaten] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isWon, setIsWon] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  const tickMs = useMemo(() => speedForEggCount(eggsEaten), [eggsEaten])

  const resetGame = useCallback(() => {
    const initialSnake = createInitialSnake()
    setSnake(initialSnake)
    setDirection({ x: 1, y: 0 })
    setPendingDirection({ x: 1, y: 0 })
    setFood(getRandomFood(initialSnake))
    setEggStyle(randomEggStyle())
    setScore(0)
    setEggsEaten(0)
    setHasStarted(false)
    setIsWon(false)
  }, [])

  const changeDirection = useCallback(
    (nextDirection) => {
      if (!isOppositeDirection(nextDirection, direction)) {
        setPendingDirection(nextDirection)
      }
    },
    [direction]
  )

  const handleDeath = useCallback(() => {
    resetGame()
  }, [resetGame])

  useEffect(() => {
    if (!hasStarted || isWon) {
      return undefined
    }

    const timer = setInterval(() => {
      setDirection(pendingDirection)
      setSnake((currentSnake) => {
        const head = currentSnake[0]
        const nextHead = { x: head.x + pendingDirection.x, y: head.y + pendingDirection.y }

        const hitWall = nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE
        const hitSelf = currentSnake.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)

        if (hitWall || hitSelf) {
          handleDeath()
          return currentSnake
        }

        const ateEgg = nextHead.x === food.x && nextHead.y === food.y
        const nextSnake = [nextHead, ...currentSnake]

        if (!ateEgg) {
          nextSnake.pop()
          return nextSnake
        }

        setEggsEaten((prevEggs) => {
          const newEggCount = prevEggs + 1
          const earnedPoints = pointsForEgg(newEggCount)
          setScore((prevScore) => {
            const newScore = prevScore + earnedPoints
            if (newScore >= WIN_SCORE) {
              setIsWon(true)
              setHasStarted(false)
              onWin?.()
            }
            return newScore
          })
          return newEggCount
        })

        setFood(getRandomFood(nextSnake))
        setEggStyle(randomEggStyle())
        return nextSnake
      })
    }, tickMs)

    return () => clearInterval(timer)
  }, [food, handleDeath, hasStarted, isWon, pendingDirection, tickMs])

  const onTouchStart = (event) => {
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
      changeDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 })
    } else {
      changeDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 })
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
      event.preventDefault()
      changeDirection(nextDirection)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [changeDirection])

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
            const isFood = food.x === x && food.y === y

            return (
              <div key={`${x}-${y}`} className="flex aspect-square items-center justify-center border border-lime-950/20">
                {isSnake && <div className="h-[70%] w-[70%] rounded-sm bg-lime-300" />}
                {isFood && <EggSprite style={eggStyle} />}
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
          onClick={() => setHasStarted((prev) => !prev)}
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
