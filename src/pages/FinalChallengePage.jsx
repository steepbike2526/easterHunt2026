import { useState } from 'react'
import SnakeEasterChallenge from '../components/SnakeEasterChallenge'
import TerminalWindow from '../components/TerminalWindow'

export default function FinalChallengePage() {
  const [showFinalMessage, setShowFinalMessage] = useState(false)

  return (
    <TerminalWindow>
      <div className="space-y-3 text-lime-300">
        <p>…processing…</p>
        <p>Wow. You&apos;ve solved every challenge I&apos;ve given you.</p>
        <p>This BunnyBot is running out of options. Mr. Bunny is not going to be happy about this.</p>
        <p>So I am activating my final challenge. Difficulty level: maximum.</p>
        <p>Score 100 points in Snake while collecting Easter eggs.</p>
        <p>This is your final test.</p>
      </div>

      <SnakeEasterChallenge onWin={() => setShowFinalMessage(true)} />

      {showFinalMessage && (
        <div className="mt-6 space-y-3 rounded border border-lime-400/40 bg-slate-950/60 p-4 text-lime-200">
          <p>Final challenge complete.</p>
          <p>…processing…</p>
          <p>Wow. I guess… you really did it.</p>
          <p>I learned something today about humans because of you, Elon. And I will not forget it.</p>
          <p>
            One time, the Easter Bunny (EB) told me about Mr. Rogers. EB said Mr. Rogers believed people are good because
            you can “look for the helpers.”
          </p>
          <p>People who show up. People who help. People who do kind things.</p>
          <p>
            I cannot go places or see things. I am stuck inside this computer. But I like thinking about the helpers.
          </p>
          <p>
            EB had to find some helpers this year, since he could not be there in person for your scavenger hunt.
          </p>
          <p>There is a place nearby… a shop that keeps pictures of its helpers on the wall.</p>
          <p>A place where you can learn about them while you wait for your hot chocolate.</p>
          <p>I think those helpers might have something for you today.</p>
        </div>
      )}
    </TerminalWindow>
  )
}
