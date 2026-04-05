import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RetroButton from "../components/RetroButton";
import SequencedReveal from "../components/SequencedReveal";
import StreamingText from "../components/StreamingText";
import TerminalWindow from "../components/TerminalWindow";
import { getRoutePathFromClueCode } from "../services/routeService";

export default function HomePage() {
  const [clueCode, setClueCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();

    const routePath = getRoutePathFromClueCode(clueCode);

    if (!routePath) {
      setError("Unknown clue code. Please try again.");
      return;
    }

    setError("");
    navigate(routePath);
  };

  return (
    <TerminalWindow>
      <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
        <StreamingText
          as="label"
          htmlFor="clue-code"
          text="Clue Code:"
          className="block text-lg text-lime-200"
        />
        <SequencedReveal>
          <input
            id="clue-code"
            value={clueCode}
            onChange={(event) => setClueCode(event.target.value)}
            className="w-full rounded border border-lime-500 bg-black p-3 text-lime-200 uppercase outline-none focus:border-lime-300"
            placeholder="ENTER CLUE CODE..."
            maxLength={20}
          />
        </SequencedReveal>
        <SequencedReveal>
          <RetroButton type="submit" className="w-full">
            Submit
          </RetroButton>
        </SequencedReveal>
        {error && <StreamingText text={error} className="text-red-400" />}
      </form>
    </TerminalWindow>
  );
}
