import { Link } from "react-router-dom";
import SequencedReveal from "../components/SequencedReveal";
import StreamingText from "../components/StreamingText";
import TerminalWindow from "../components/TerminalWindow";
import { ROUTES, getRoutePath } from "../services/routeService";

export default function NotFoundPage() {
  return (
    <TerminalWindow>
      <StreamingText
        as="h1"
        text="404 // Unknown Route"
        className="text-3xl font-bold text-red-300"
      />
      <StreamingText
        text="That clue code is not part of Easter Hunt 2026."
        className="mt-4 text-lime-300"
      />
      <SequencedReveal>
        <Link
          className="mt-6 inline-block text-lime-200 underline"
          to={getRoutePath(ROUTES.INTRO)}
        >
          Return to Initialization Page
        </Link>
      </SequencedReveal>
    </TerminalWindow>
  );
}
