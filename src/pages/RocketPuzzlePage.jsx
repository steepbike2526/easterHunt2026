import { useState } from 'react'
import RetroButton from '../components/RetroButton'
import TerminalWindow from '../components/TerminalWindow'

const openingLines = [
  'Houston… we might have a problem.',
  'This BunnyBot was not programmed for this level of genius.',
  'But don’t get too confident.',
  'This next clue will definitely slow you down.'
]

const puzzleLines = [
  'So many places in this house for a little bunny nap.',
  'But where did this bunny hide the clue?',
  'To find out where to look, you’ll need to decode this message:'
]

const hints = ['First, shift each letter back by one.', 'Then, unscramble the words.']

export default function RocketPuzzlePage() {
  const [hasStarted, setHasStarted] = useState(false)
  const [shownHintCount, setShownHintCount] = useState(0)

  const onHintRequest = () => {
    setShownHintCount((prev) => Math.min(prev + 1, hints.length))
  }

  return (
    <TerminalWindow>
      <div className="space-y-4 text-lime-300">
        <p className="animate-pulse text-lime-200">(Rocket animation plays.)</p>
        {openingLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>Ready?</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <RetroButton onClick={() => setHasStarted(true)} className="md:min-w-40">
          YES
        </RetroButton>
        <RetroButton className="md:min-w-40">NO</RetroButton>
      </div>

      {hasStarted && (
        <div className="mt-8 space-y-4 rounded border border-lime-300 bg-lime-950/40 p-5 text-lime-200">
          {puzzleLines.map((line) => (
            <p key={line}>{line}</p>
          ))}

          <p className="text-2xl font-bold uppercase tracking-wider text-lime-100 md:text-4xl">EFC TUOFQBS</p>

          <div className="pt-2">
            <RetroButton onClick={onHintRequest} disabled={shownHintCount >= hints.length}>
              Request hint
            </RetroButton>
          </div>

          {shownHintCount > 0 && (
            <div className="space-y-2 rounded border border-lime-500/50 bg-slate-950/60 p-4">
              {hints.slice(0, shownHintCount).map((hint, index) => (
                <p key={hint}>Hint {index + 1}: {hint}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </TerminalWindow>
  )
}
