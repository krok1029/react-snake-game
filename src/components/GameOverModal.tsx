import { HIGH_SCORE_KEY } from "@/const";

interface GameOverModal {
  finalScore: number;
}
const GameOverModal: React.FC<GameOverModal> = ({ finalScore }) => {
  const currentHighScore = Number(localStorage.getItem(HIGH_SCORE_KEY));
  const highScoreBeaten = finalScore > currentHighScore;
  if (highScoreBeaten) {
    localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
  }

  return (
    <div id="game-over-modal-container">
      <div id="game-over-modal">
        <h2>Game Over</h2>
        <p className="final-score">
          Your Final Score: <span>{finalScore}</span>
        </p>
        {highScoreBeaten && finalScore > 0 && (
          <p className="congratulate">🏆 You beat the high score! 🏆</p>
        )}
        <p>
          Press <kbd>Enter</kbd> to pause
        </p>
      </div>
    </div>
  );
};
export default GameOverModal;
