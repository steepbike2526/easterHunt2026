import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetroButton from "../components/RetroButton";
import SequencedReveal from "../components/SequencedReveal";
import StreamingText from "../components/StreamingText";
import TerminalWindow from "../components/TerminalWindow";

const openingLines = [
  "Houston… we might have a problem.",
  "This BunnyBot was not programmed for this level of genius.",
  "But don’t get too confident.",
  "This next clue will definitely slow you down.",
];

const puzzleLines = [
  "So many places in this house for a little bunny nap.",
  "But where did this bunny hide the clue?",
  "To find out where to look, you’ll need to first shift your thinking before you can decode this message:",
];

const hints = [
  "First, shift each letter back by one.",
  "Then, unscramble the words.",
];

export default function RocketPuzzlePage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [shownHintCount, setShownHintCount] = useState(0);
  const [showRocketAnimation, setShowRocketAnimation] = useState(true);
  const [isRocketInFlight, setIsRocketInFlight] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const launchTimer = setTimeout(() => {
      setIsRocketInFlight(true);
    }, 80);

    const hideTimer = setTimeout(() => {
      setShowRocketAnimation(false);
    }, 4200);

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const onHintRequest = () => {
    setShownHintCount((prev) => Math.min(prev + 1, hints.length));
  };

  return (
    <>
      {showRocketAnimation && (
        <span
          aria-hidden="true"
          className={`pointer-events-none fixed bottom-[-4rem] left-[-4rem] z-50 block text-6xl transition-all duration-[3600ms] ease-linear md:text-7xl ${
            isRocketInFlight
              ? "translate-x-[calc(100vw+10rem)] -translate-y-[calc(100vh+10rem)] opacity-0"
              : "translate-x-0 translate-y-0 opacity-100"
          }`}
        >
          🚀
        </span>
      )}

      <TerminalWindow>
        <div className="space-y-4 text-lime-300">
          {openingLines.map((line) => (
            <StreamingText key={line} text={line} />
          ))}
          <StreamingText text="Ready?" />
        </div>

        <SequencedReveal>
          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <RetroButton
              onClick={() => setHasStarted(true)}
              className="md:min-w-40"
            >
              YES
            </RetroButton>
          </div>
        </SequencedReveal>

        {hasStarted && (
          <div className="mt-8 space-y-4 rounded border border-lime-300 bg-lime-950/40 p-5 text-lime-200">
            {puzzleLines.map((line) => (
              <StreamingText key={line} text={line} />
            ))}

            <StreamingText
              text="EFC TUOFQBS"
              className="text-2xl font-bold uppercase tracking-wider text-lime-100 md:text-4xl"
            />

            <SequencedReveal>
              <div className="pt-2">
                <RetroButton
                  onClick={onHintRequest}
                  disabled={shownHintCount >= hints.length}
                >
                  Request hint
                </RetroButton>
              </div>
            </SequencedReveal>

            {shownHintCount > 0 && (
              <div className="space-y-2 rounded border border-lime-500/50 bg-slate-950/60 p-4">
                {hints.slice(0, shownHintCount).map((hint, index) => (
                  <StreamingText
                    key={hint}
                    text={`Hint ${index + 1}: ${hint}`}
                  />
                ))}
              </div>
            )}

            <SequencedReveal>
              <div className="pt-2">
                <RetroButton onClick={() => navigate("/")}>
                  Return to homepage
                </RetroButton>
              </div>
            </SequencedReveal>
          </div>
        )}
      </TerminalWindow>
    </>
  );
}
