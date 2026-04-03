import { Route, Routes } from 'react-router-dom'
import AssessmentPage from './pages/AssessmentPage'
import ClueOnePage from './pages/ClueOnePage'
import FinalChallengePage from './pages/FinalChallengePage'
import FractionAssessmentPage from './pages/FractionAssessmentPage'
import HomePage from './pages/HomePage'
import IntroPage from './pages/IntroPage'
import NotFoundPage from './pages/NotFoundPage'
import RocketPuzzlePage from './pages/RocketPuzzlePage'
import { ROUTES, getRoutePath } from './services/routeService'

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 font-retro text-lime-300">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={getRoutePath(ROUTES.INTRO)} element={<IntroPage />} />
        <Route path={getRoutePath(ROUTES.ASSESSMENT)} element={<AssessmentPage />} />
        <Route path={getRoutePath(ROUTES.CLUE_ONE)} element={<ClueOnePage />} />
        <Route path={getRoutePath(ROUTES.FRACTION_ASSESSMENT)} element={<FractionAssessmentPage />} />
        <Route path={getRoutePath(ROUTES.ROCKET_PUZZLE)} element={<RocketPuzzlePage />} />
        <Route path={getRoutePath(ROUTES.FINAL_CHALLENGE)} element={<FinalChallengePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}
