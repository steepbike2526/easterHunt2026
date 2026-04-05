import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RetroButton from "../components/RetroButton";
import SequencedReveal from "../components/SequencedReveal";
import StreamingText from "../components/StreamingText";
import TerminalWindow from "../components/TerminalWindow";
import { ROUTES, getRoutePath } from "../services/routeService";
import { isPositiveInteger, normalizeAnswer } from "../utils/answerUtils";

const challengeConfig = {
  language: {
    label: "Language",
    intro:
      "Language Assessment Initiated… Reorder the letters below to form a real word:\nT A E R S E",
    feedback: [
      "Correct.",
      "Language processing skills: strong.",
      "Seasonal awareness: excellent.",
    ],
    isCorrect: (value) => normalizeAnswer(value) === "easter",
  },
  math: {
    label: "Math",
    intro:
      "Math Assessment Initiated… What number comes next in this pattern? 1, 1, 2, 3, 5, 8, __",
    feedback: [
      "Correct.",
      "Pattern recognition skills: impressive.",
      "Mathematical reasoning: above average.",
    ],
    isCorrect: (value) => normalizeAnswer(value) === "13",
  },
  physical: {
    label: "Physical",
    intro:
      "Physical Assessment Initiated… Perform as many sit-ups as you can. Enter the total number completed.",
    feedback: [
      "Physical effort detected.",
      "Core strength: acceptable.",
      "Bunny fitness standards: satisfied.",
    ],
    isCorrect: (value) => isPositiveInteger(value) && Number(value) > 10,
  },
};

const challengeOrder = ["language", "math", "physical"];

export default function AssessmentPage() {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [showMathHint, setShowMathHint] = useState(false);
  const [answers, setAnswers] = useState({
    language: "",
    math: "",
    physical: "",
  });
  const [completed, setCompleted] = useState({
    language: false,
    math: false,
    physical: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const allComplete = useMemo(
    () => Object.values(completed).every(Boolean),
    [completed],
  );

  useEffect(() => {
    if (!allComplete) {
      return;
    }

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [allComplete]);

  const onChallengeSelect = (challengeKey) => {
    setActiveChallenge(challengeKey);
    setShowMathHint(false);
    setError("");
  };

  const onSubmit = () => {
    if (!activeChallenge) {
      return;
    }

    const challenge = challengeConfig[activeChallenge];
    const answer = answers[activeChallenge];

    if (!challenge.isCorrect(answer)) {
      setError("Not quite. Try again.");
      return;
    }

    setCompleted((prev) => ({ ...prev, [activeChallenge]: true }));
    setActiveChallenge(null);
    setShowMathHint(false);
    setError("");
  };

  return (
    <TerminalWindow>
      <div className="space-y-4 text-lime-300">
        <StreamingText text="To determine if you are ready to take on this Easter Hunt Challenge, I will begin with a brief skills assessment." />
        <StreamingText text="You will complete three tasks: one language challenge, one math challenge, one physical challenge." />
        <StreamingText text="Once complete, I will generate your hunt." />
        <StreamingText text="Please make your selection:" />
      </div>

      <SequencedReveal>
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          {challengeOrder.map((key) => (
            <RetroButton
              key={key}
              onClick={() => onChallengeSelect(key)}
              disabled={completed[key]}
            >
              {challengeConfig[key].label}
            </RetroButton>
          ))}
        </div>
      </SequencedReveal>

      {activeChallenge && (
        <div className="mt-8 space-y-4 rounded border border-lime-400/50 bg-slate-950/60 p-4">
          <StreamingText
            text={challengeConfig[activeChallenge].intro}
            className="whitespace-pre-line text-lime-200"
          />
          <SequencedReveal>
            <input
              value={answers[activeChallenge]}
              onChange={(event) =>
                setAnswers((prev) => ({
                  ...prev,
                  [activeChallenge]: event.target.value,
                }))
              }
              className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 outline-none focus:border-lime-300"
              placeholder="Enter your answer"
            />
          </SequencedReveal>
          <SequencedReveal>
            <RetroButton onClick={onSubmit}>Submit</RetroButton>
          </SequencedReveal>
          {activeChallenge === "math" && (
            <SequencedReveal>
              <div className="space-y-2">
                <RetroButton onClick={() => setShowMathHint(true)}>
                  Request hint
                </RetroButton>
                {showMathHint && (
                  <StreamingText
                    text="Add the first two numbers to get the third."
                    className="text-lime-300"
                  />
                )}
              </div>
            </SequencedReveal>
          )}
          {error && <StreamingText text={error} className="text-red-400" />}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {challengeOrder
          .filter((key) => completed[key])
          .map((key) => (
            <div
              key={key}
              className="rounded border border-lime-700/70 bg-slate-900/70 p-4 text-lime-300"
            >
              {challengeConfig[key].feedback.map((line) => (
                <StreamingText key={line} text={line} />
              ))}
            </div>
          ))}
      </div>

      {allComplete && (
        <div className="mt-10 space-y-4 rounded border border-lime-300 bg-lime-950/40 p-5 text-lime-200">
          <StreamingText text="Bunny Assessment complete. Analyzing results…" />
          <StreamingText text="Results indicate Elon is ready for Easter magic." />
          <StreamingText text="Challenge initiation detected. Elon vs. EasterBot is now in progress." />
          <StreamingText text="Initializing Easter Hunt 2026.......................proceed to first clue." />
          <SequencedReveal>
            <div className="flex flex-col gap-3 md:flex-row">
              <RetroButton
                onClick={() => navigate(getRoutePath(ROUTES.CLUE_ONE))}
              >
                Proceed to first clue
              </RetroButton>
            </div>
          </SequencedReveal>
        </div>
      )}
    </TerminalWindow>
  );
}
