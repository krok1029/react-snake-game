interface PausedModalProps {
  toggleIsPlaying: () => void;
}

export default function PausedModal({ toggleIsPlaying }: PausedModalProps) {
  return (
    <div id="paused-modal-container" onClick={toggleIsPlaying}>
      <div id="paused-modal">
        <h2>Paused</h2>
        <p className="click-dir">(Click anywhere to continue)</p>
      </div>
    </div>
  );
}
