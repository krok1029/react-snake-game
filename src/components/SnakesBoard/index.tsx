import { useRef, useEffect } from "react";
import { GameEngine } from "./SnakeGame";

import "./SnakesBoardStyles.css";
import { Nullable, SnakeMovements } from "@/types";

interface SnakeGameBoard {
  isPlaying: boolean;
  externalScore: number;
  setScore: (score: number) => void;
  setIsGameOver: (isGameOver: boolean) => void;
}

const PLAYGROUND_LENGTH = 500;

const SnakeBoard: React.FC<SnakeGameBoard> = ({
  isPlaying,
  externalScore,
  setScore,
  setIsGameOver,
}) => {
  const canvasRef = useRef<Nullable<HTMLCanvasElement>>(null);
  const context = useRef<Nullable<CanvasRenderingContext2D>>(null);
  const snakes = useRef<Nullable<GameEngine>>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      throw new Error("canvasRef is not used");
    }

    canvasRef.current.width = PLAYGROUND_LENGTH;
    canvasRef.current.height = PLAYGROUND_LENGTH;
    context.current = canvasRef.current.getContext("2d");

    if (context.current) {
      const ctx = context.current;
      snakes.current = new GameEngine(
        ctx,
        PLAYGROUND_LENGTH,
        externalScore,
        setScore,
        setIsGameOver,
        isPlaying
      );
      const { snake } = snakes.current;

      window.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "w":
          case "ArrowUp":
            snake.changeMovement(SnakeMovements.Top);
            break;
          case "s":
          case "ArrowDown":
            snake.changeMovement(SnakeMovements.Bottom);
            break;
          case "d":
          case "ArrowRight":
            snake.changeMovement(SnakeMovements.Right);
            break;
          case "a":
          case "ArrowLeft":
            snake.changeMovement(SnakeMovements.Left);
            break;
        }
      });
    }

    return () => {
      canvasRef.current = null;
      context.current = null;
      snakes.current = null;
    };
  }, []);

  useEffect(() => {
    if (snakes.current) {
      snakes.current.animate(isPlaying);
    }
  }, [isPlaying]);

  return (
    <div>
      <canvas id="game-canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default SnakeBoard;
