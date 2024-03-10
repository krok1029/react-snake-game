import { useEffect, useState } from "react";
import SnakeBoard from "@/components/SnakesBoard";
import GameOverModal from "@/components/GameOverModal";
import PausedModal from "@/components/PausedModal";
import { HIGH_SCORE_KEY } from "@/const";
import "@/components/styles.css";

const SnakesGame = () => {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isIdle, setIsIdle] = useState(true);

  const highScore = Number(localStorage.getItem(HIGH_SCORE_KEY));

  const toggleIsPlaying = () => setIsPlaying((perv) => !perv);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "Enter":
          if (isIdle || isGameOver) {
            setIsPlaying(true);
            setIsIdle(false);
            setIsGameOver(false);
            setScore(0);
          }
          break;
        case "Escape":
          toggleIsPlaying();
          break;
      }
    });
  }, []);

  return (
    <div id="snakes-game-container">
      <p className="high-score">High Score: {highScore}</p>

      {isIdle ? (
        <p className="new-game-hint">
          Press <kbd>Enter</kbd> to pause
        </p>
      ) : (
        <>
          <p className="score">
            <span>Score:</span>
            <span>{score}</span>
          </p>
          <p className="pause-hint">
            <strong>PAUSE:</strong> Press <kbd>Esc</kbd> to pause
          </p>
        </>
      )}
      {!isGameOver && !isIdle && (
        <SnakeBoard
          isPlaying={isPlaying}
          externalScore={score}
          setScore={setScore}
          setIsGameOver={setIsGameOver}
        />
      )}

      {isGameOver && <GameOverModal finalScore={score} />}
      {!(isIdle || isGameOver || isPlaying) && (
        <PausedModal toggleIsPlaying={toggleIsPlaying} />
      )}
    </div>
  );
};

export default SnakesGame;
