import { useState } from "react";
import SnakeEasterChallenge from "../components/SnakeEasterChallenge";
import StreamingText from "../components/StreamingText";
import TerminalWindow from "../components/TerminalWindow";

export default function FinalChallengePage() {
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isSnakeVisible, setIsSnakeVisible] = useState(false);

  return (
    <TerminalWindow>
      <div className="space-y-3 text-lime-300">
        <StreamingText text="…processing…" />
        <StreamingText text="Wow. You've solved every challenge I've given you." />
        <StreamingText text="This BunnyBot is running out of options. Mr. Bunny is not going to be happy about this." />
        <StreamingText text="So I am activating my final challenge. Difficulty level: maximum." />
        <StreamingText text="Stanley the snake has never had a full basket of eggs for easter. If you can help him find enough easter eggs to completely fill his basket, I will consider giving you a basket this year." />
        <StreamingText
          text="This is your final test."
          onComplete={() => setIsSnakeVisible(true)}
        />
      </div>

      {isSnakeVisible && (
        <SnakeEasterChallenge onWin={() => setShowFinalMessage(true)} />
      )}

      {showFinalMessage && (
        <div className="mt-6 space-y-3 rounded border border-lime-400/40 bg-slate-950/60 p-4 text-lime-200">
          <StreamingText text="Final challenge complete." />
          <StreamingText text="…processing…" />
          <StreamingText text="Wow. I guess… you really did it." />
          <StreamingText text="I learned something today about humans because of you, Elon. And I will not forget it." />
          <StreamingText text="One time, the Easter Bunny (EB) told me about Mr. Rogers. EB said Mr. Rogers believed people are good because you can “look for the helpers.”" />
          <StreamingText text="People who show up. People who help. People who do kind things." />
          <StreamingText text="I cannot go places or see things. I am stuck inside this computer. But I like thinking about the helpers." />
          <StreamingText text="EB had to find some helpers this year, since he could not be there in person for your scavenger hunt." />
          <StreamingText text="There is a place nearby… a shop that keeps pictures of its helpers on the wall." />
          <StreamingText text="A place where you can learn about them while you wait for your hot chocolate." />
          <StreamingText text="I think those helpers might have something for you today." />
        </div>
      )}
    </TerminalWindow>
  );
}
