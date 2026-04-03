import TerminalWindow from '../components/TerminalWindow'

export default function ClueOnePage() {
  return (
    <TerminalWindow>
      <h1 className="mb-6 text-2xl font-bold uppercase tracking-widest text-lime-200 md:text-4xl">Clue One</h1>
      <div className="space-y-2 text-lg text-lime-300 md:text-2xl">
        <p>Bruno’s room is big and blue,</p>
        <p>That’s where you’ll find your next clue.</p>
        <p>On the wall, not on the ground,</p>
        <p>A traveler’s story can be found.</p>
      </div>
    </TerminalWindow>
  )
}
