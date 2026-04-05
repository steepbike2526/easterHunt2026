import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetroButton from "../components/RetroButton";
import SequencedReveal from "../components/SequencedReveal";
import StreamingText from "../components/StreamingText";
import TerminalWindow from "../components/TerminalWindow";
import { ROUTES, getRoutePath } from "../services/routeService";

const lines = [
  "…thinking… loading…",
  "Welcome, Elon.",
  "I am your EasterBot, and this is your Scavenger Hunt.",
  "Are you ready?",
];

export default function IntroPage() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= lines.length) {
      return;
    }

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, 850);

    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <TerminalWindow>
      <div className="space-y-3 text-lime-300">
        {lines.slice(0, visibleCount).map((line) => (
          <StreamingText
            key={line}
            text={`> ${line}`}
            className="text-base leading-relaxed md:text-xl"
          />
        ))}
        {visibleCount < lines.length && (
          <p className="animate-blink text-lime-200">█</p>
        )}
      </div>

      {visibleCount >= lines.length && (
        <SequencedReveal>
          <div className="mt-10 flex flex-col gap-4 md:flex-row">
            <RetroButton
              onClick={() => navigate(getRoutePath(ROUTES.ASSESSMENT))}
              className="md:min-w-44"
            >
              YES
            </RetroButton>
          </div>
        </SequencedReveal>
      )}
    </TerminalWindow>
  );
}
