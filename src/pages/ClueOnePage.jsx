import { useNavigate } from 'react-router-dom'
import RetroButton from '../components/RetroButton'
import StreamingText from '../components/StreamingText'
import TerminalWindow from '../components/TerminalWindow'

export default function ClueOnePage() {
  const navigate = useNavigate()

  return (
    <TerminalWindow>
      <StreamingText as="h1" text="Clue One" className="mb-6 text-2xl font-bold uppercase tracking-widest text-lime-200 md:text-4xl" />
      <div className="space-y-2 text-lg text-lime-300 md:text-2xl">
        <StreamingText text="Bruno’s room is big and blue," />
        <StreamingText text="That’s where you’ll find your next clue." />
        <StreamingText text="On the wall, not on the ground," />
        <StreamingText text="A traveler’s story can be found." />
      </div>

      <div className="mt-10">
        <RetroButton onClick={() => navigate('/')}>Return to homepage</RetroButton>
      </div>
    </TerminalWindow>
  )
}
