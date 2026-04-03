import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RetroButton from '../components/RetroButton'
import TerminalWindow from '../components/TerminalWindow'
import { ROUTES, getRoutePath } from '../services/routeService'
import { isPositiveInteger, normalizeAnswer } from '../utils/answerUtils'

const challengeConfig = {
  language: {
    label: 'Language',
    intro: 'Language Assessment Initiated… Reorder the letters below to form a real word: T A E R S E',
    feedback: ['Correct.', 'Language processing skills: strong.', 'Seasonal awareness: excellent.'],
    isCorrect: (value) => normalizeAnswer(value) === 'easter'
  },
  math: {
    label: 'Math',
    intro: 'Math Assessment Initiated… What number comes next in this pattern? 1, 4, 9, 16, __',
    feedback: ['Correct.', 'Pattern recognition skills: impressive.', 'Mathematical reasoning: above average.'],
    isCorrect: (value) => normalizeAnswer(value) === '25'
  },
  physical: {
    label: 'Physical',
    intro: 'Physical Assessment Initiated… Perform as many sit-ups as you can. Enter the total number completed.',
    feedback: ['Physical effort detected.', 'Core strength: acceptable.', 'Bunny fitness standards: satisfied.'],
    isCorrect: (value) => isPositiveInteger(value) && Number(value) > 10
  }
}

const challengeOrder = ['language', 'math', 'physical']

export default function AssessmentPage() {
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [answers, setAnswers] = useState({ language: '', math: '', physical: '' })
  const [completed, setCompleted] = useState({ language: false, math: false, physical: false })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const allComplete = useMemo(() => Object.values(completed).every(Boolean), [completed])

  const onChallengeSelect = (challengeKey) => {
    setActiveChallenge(challengeKey)
    setError('')
  }

  const onSubmit = () => {
    if (!activeChallenge) {
      return
    }

    const challenge = challengeConfig[activeChallenge]
    const answer = answers[activeChallenge]

    if (!challenge.isCorrect(answer)) {
      setError('Not quite. Try again.')
      return
    }

    setCompleted((prev) => ({ ...prev, [activeChallenge]: true }))
    setActiveChallenge(null)
    setError('')
  }

  return (
    <TerminalWindow>
      <div className="space-y-4 text-lime-300">
        <p>To determine if you are ready to take on this Easter Hunt Challenge, I will begin with a brief skills assessment.</p>
        <p>You will complete three tasks: one language challenge, one math challenge, one physical challenge.</p>
        <p>Once complete, I will generate your hunt.</p>
        <p>Please make your selection:</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        {challengeOrder.map((key) => (
          <RetroButton key={key} onClick={() => onChallengeSelect(key)} disabled={completed[key]}>
            {challengeConfig[key].label}
          </RetroButton>
        ))}
      </div>

      {activeChallenge && (
        <div className="mt-8 space-y-4 rounded border border-lime-400/50 bg-slate-950/60 p-4">
          <p className="text-lime-200">{challengeConfig[activeChallenge].intro}</p>
          <input
            value={answers[activeChallenge]}
            onChange={(event) =>
              setAnswers((prev) => ({
                ...prev,
                [activeChallenge]: event.target.value
              }))
            }
            className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 outline-none focus:border-lime-300"
            placeholder="Enter your answer"
          />
          <RetroButton onClick={onSubmit}>Submit</RetroButton>
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {challengeOrder
          .filter((key) => completed[key])
          .map((key) => (
            <div key={key} className="rounded border border-lime-700/70 bg-slate-900/70 p-4 text-lime-300">
              {challengeConfig[key].feedback.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          ))}
      </div>

      {allComplete && (
        <div className="mt-10 space-y-4 rounded border border-lime-300 bg-lime-950/40 p-5 text-lime-200">
          <p>Bunny Assessment complete. Analyzing results…</p>
          <p>Results indicate Elon is ready for Easter magic.</p>
          <p>Challenge initiation detected. Elon vs. EasterBot is now in progress.</p>
          <p>Proceed to first clue. Initialize Bunny Hunt 2026.</p>
          <p>You may now initialize Bunny Hunt 2026.</p>
          <RetroButton onClick={() => navigate(getRoutePath(ROUTES.CLUE_ONE))}>Proceed to first clue</RetroButton>
        </div>
      )}
    </TerminalWindow>
  )
}
