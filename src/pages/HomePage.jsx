import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RetroButton from '../components/RetroButton'
import TerminalWindow from '../components/TerminalWindow'
import { getRoutePathFromClueCode } from '../services/routeService'

export default function HomePage() {
  const [clueCode, setClueCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()

    const routePath = getRoutePathFromClueCode(clueCode)

    if (!routePath) {
      setError('Unknown clue code. Please try again.')
      return
    }

    setError('')
    navigate(routePath)
  }

  return (
    <TerminalWindow>
      <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
        <label htmlFor="clue-code" className="block text-lg text-lime-200">
          Enter clue code
        </label>
        <input
          id="clue-code"
          value={clueCode}
          onChange={(event) => setClueCode(event.target.value)}
          className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 uppercase outline-none focus:border-lime-300"
          placeholder="e.g. CLU1"
          maxLength={4}
        />
        <RetroButton type="submit" className="w-full">
          Submit
        </RetroButton>
        {error && <p className="text-red-400">{error}</p>}
      </form>
    </TerminalWindow>
  )
}
