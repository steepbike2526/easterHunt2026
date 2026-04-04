import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RetroButton from '../components/RetroButton'
import StreamingText from '../components/StreamingText'
import TerminalWindow from '../components/TerminalWindow'
import { normalizeAnswer } from '../utils/answerUtils'

const initialAnswers = {
  denominatorTen: '',
  largerFraction: '',
  simplifiedFraction: ''
}

const isEquivalentHalfWithTen = (value) => {
  const normalized = normalizeAnswer(value)
  return normalized === '5/10' || normalized === '5'
}

const isLargerFractionCorrect = (value) => {
  const normalized = normalizeAnswer(value)
  return normalized === '3/4' || normalized === '3÷4'
}

const isSimplifiedFractionCorrect = (value) => {
  const normalized = normalizeAnswer(value)
  return normalized === '3/4' || normalized === '0.75'
}

export default function FractionAssessmentPage() {
  const [answers, setAnswers] = useState(initialAnswers)
  const [isCorrect, setIsCorrect] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const allCorrect = useMemo(
    () =>
      isEquivalentHalfWithTen(answers.denominatorTen) &&
      isLargerFractionCorrect(answers.largerFraction) &&
      isSimplifiedFractionCorrect(answers.simplifiedFraction),
    [answers]
  )

  const onAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const onSubmit = () => {
    if (!allCorrect) {
      setIsCorrect(false)
      setError('Not quite. Try again.')
      return
    }

    setIsCorrect(true)
    setError('')
  }

  return (
    <TerminalWindow>
      <div className="space-y-4 text-lime-300">
        <StreamingText text="Nice work. You solved that clue." />
        <StreamingText text="But that was too easy. That won’t do." />
        <StreamingText text="Let’s see how you handle something a little more precise." />
      </div>

      <div className="mt-8 space-y-4 rounded border border-lime-400/50 bg-slate-950/60 p-4 text-lime-200">
        <StreamingText text="Fraction Assessment Initiated…" className="font-semibold" />
        <StreamingText text="1.What is an equivalent fraction to 1/2 with a denominator of 10?" />
        <input
          value={answers.denominatorTen}
          onChange={(event) => onAnswerChange('denominatorTen', event.target.value)}
          className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 outline-none focus:border-lime-300"
          placeholder="Enter your answer"
        />

        <StreamingText text="2. Which fraction is larger: 3/4 or 5/8?" />
        <input
          value={answers.largerFraction}
          onChange={(event) => onAnswerChange('largerFraction', event.target.value)}
          className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 outline-none focus:border-lime-300"
          placeholder="Enter your answer"
        />

        <StreamingText text="3. Simplify: 6/8" />
        <input
          value={answers.simplifiedFraction}
          onChange={(event) => onAnswerChange('simplifiedFraction', event.target.value)}
          className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 outline-none focus:border-lime-300"
          placeholder="Enter your answer"
        />

        <RetroButton onClick={onSubmit}>Submit</RetroButton>
        {error && <StreamingText text={error} className="text-red-400" />}
      </div>

      {isCorrect && (
        <div className="mt-8 space-y-4 rounded border border-lime-300 bg-lime-950/40 p-5 text-lime-200">
          <StreamingText text="Gulp...now I'm nervous." />
          <StreamingText text="I knew you were good… but I didn’t realize just how much smarter you are than last year." />
          <StreamingText text="Mr. Bunny will not be happy with me if I don’t give you a real challenge." />
          <StreamingText text="I am sure this next clue will puzzle you." />

          <StreamingText
            as="h1"
            text="Clue Two"
            className="pt-2 text-2xl font-bold uppercase tracking-widest text-lime-200 md:text-4xl"
          />
          <div className="space-y-2 text-lg text-lime-300 md:text-2xl">
            <StreamingText text="This week you watched something BIG take flight," />
            <StreamingText text="A mission that launched into the night." />
            <StreamingText text="You’ve heard the words from long ago," />
            <StreamingText text="From moon-bound crews we all know." />
            <StreamingText text="Now think of a mission that’s yours to explore," />
            <StreamingText text="With pieces and plans and so much in store." />
            <StreamingText text="Built or not, it’s ready for you," />
            <StreamingText text="Go look at the box to find your next clue." />
          </div>

          <div className="flex flex-col gap-3 pt-3 md:flex-row">
            <RetroButton onClick={() => navigate('/')}>Return to homepage</RetroButton>
          </div>
        </div>
      )}
    </TerminalWindow>
  )
}
