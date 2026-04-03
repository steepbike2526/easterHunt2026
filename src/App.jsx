import { Navigate, Route, Routes } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import AssessmentPage from './pages/AssessmentPage'
import ClueOnePage from './pages/ClueOnePage'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES, getRoutePath } from './services/routeService'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 font-retro text-lime-300">
      <Routes>
        <Route path={getRoutePath(ROUTES.INTRO)} element={<IntroPage />} />
        <Route path={getRoutePath(ROUTES.ASSESSMENT)} element={<AssessmentPage />} />
        <Route path={getRoutePath(ROUTES.CLUE_ONE)} element={<ClueOnePage />} />
        <Route path="/" element={<Navigate to={getRoutePath(ROUTES.INTRO)} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}
