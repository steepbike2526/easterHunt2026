import { Link } from 'react-router-dom'
import TerminalWindow from '../components/TerminalWindow'
import { ROUTES, getRoutePath } from '../services/routeService'

export default function NotFoundPage() {
  return (
    <TerminalWindow>
      <h1 className="text-3xl font-bold text-red-300">404 // Unknown Route</h1>
      <p className="mt-4 text-lime-300">That clue code is not part of Bunny Hunt 2026.</p>
      <Link className="mt-6 inline-block text-lime-200 underline" to={getRoutePath(ROUTES.INTRO)}>
        Return to Initialization Page
      </Link>
    </TerminalWindow>
  )
}
