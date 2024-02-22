import { Cell, Coordinate } from "@/types";
import matchCoord from "@/utils/matchCoord";
import Snake from "./Snake";

export class GameEngine {
  private context: CanvasRenderingContext2D;
  private boardSidesLength: number;
  private numOfRowsAndCols: number;
  private _gameBoard: Cell[][];
  private _foodCoordinate: Coordinate;
  private staggerFrame: number;
  private currentFrameCount: number;

  private externalScore: number;
  private setScore: (score: number) => void;
  private setIsGameOver: (isGameOver: boolean) => void;

  private internalPlayState: boolean;

  snake: Snake;

  constructor(
    context: CanvasRenderingContext2D,
    boardSidesLength: number,
    externalScore: number,
    setScore: (score: number) => void,
    setIsGameOver: (isGameOver: boolean) => void,
    isPlaying: boolean
  ) {
    this.context = context;

    this.snake = new Snake();
    this._foodCoordinate = {
      row: -1,
      col: -1,
    };

    this.boardSidesLength = boardSidesLength;
    this.numOfRowsAndCols = 30;
    this._gameBoard = [];
    this.externalScore = externalScore;
    this.setScore = setScore;
    this.setIsGameOver = setIsGameOver;

    this.currentFrameCount = 0;
    this.staggerFrame = 8;

    this.internalPlayState = isPlaying;
  }

  get score() {
    return Math.max(0, this.snake.length * 10 - this.snake.defaultlength * 10);
  }

  private get gameBoard(): Cell[][] {
    if (this._gameBoard.length === 0) {
      const nRows = this.numOfRowsAndCols;
      const nCols = this.numOfRowsAndCols;

      for (let i = 0; i < nRows; i++) {
        this._gameBoard.push(Array.from(Array(nCols)).fill(null));
      }
    }

    return this._gameBoard;
  }

  private set gameBoard(newGameBoard: Cell[][]) {
    this._gameBoard = newGameBoard;
  }

  private foodCoordInSnakeCoords(foodCoord: Coordinate) {
    const match = this.snake.bodyCoordinates.some((snakeCoord) =>
      matchCoord(snakeCoord, foodCoord)
    );

    return match;
  }

  private rendCoord() {
    return {
      row: Math.floor(Math.random() * this.numOfRowsAndCols),
      col: Math.floor(Math.random() * this.numOfRowsAndCols),
    };
  }

  private get foodCoordinate() {
    if (this._foodCoordinate.row < 0 || this._foodCoordinate.col < 0) {
      let randCoord = this.rendCoord();
      while (this.foodCoordInSnakeCoords(randCoord)) {
        randCoord = this.rendCoord();
      }

      this._foodCoordinate = randCoord;
    }

    return this._foodCoordinate;
  }

  private set foodCoordinate(newCoord: Coordinate) {
    if (newCoord.row < 0 || newCoord.col < 0) {
      let randCoord = this.rendCoord();
      while (this.foodCoordInSnakeCoords(randCoord)) {
        randCoord = this.rendCoord();
      }

      this._foodCoordinate = randCoord;
    } else {
      this._foodCoordinate = newCoord;
    }
  }

  private generateGrid() {
    const cellWidth = this.boardSidesLength / this.numOfRowsAndCols;
    const cellHeight = this.boardSidesLength / this.numOfRowsAndCols;

    this.gameBoard.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        switch (cell) {
          case Cell.Snake:
            this.context.fillStyle = "#A2C579";
            break;
          case Cell.Food:
            this.context.fillStyle = "salmon";
            break;
          case Cell.Null:
            this.context.fillStyle = "white";
            break;
        }
        this.context.fillRect(
          colIndex * cellWidth,
          rowIndex * cellHeight,
          cellWidth,
          cellHeight
        );
      });
    });
  }

  private setFoodOnBoard() {
    if (this.snake.justAte) {
      this.foodCoordinate = {
        row: -1,
        col: -1,
      };
    }

    this.gameBoard[this.foodCoordinate.row][this.foodCoordinate.col] =
      Cell.Food;
  }

  private setSnakeOnBoard() {
    const newBoard = this.gameBoard.map((row) => row.fill(Cell.Null));
    this.snake.bodyCoordinates.forEach((snakeCoord) => {
      newBoard[snakeCoord.row][snakeCoord.col] = Cell.Snake;
    });
    this.gameBoard = newBoard;
  }

  private renderBoard() {
    this.setSnakeOnBoard();
    this.setFoodOnBoard();
    this.generateGrid();
  }

  private snakeIsOutOfBounds() {
    const snakeHead = this.snake.headCoordinate;
    const boundingArea = {
      min: 0,
      max: this.numOfRowsAndCols - 1,
    };
    const rowOutOfBounds =
      snakeHead.row > boundingArea.max || snakeHead.row < boundingArea.min;
    const columnOutOfBounds =
      snakeHead.col > boundingArea.max || snakeHead.col < boundingArea.min;

    return rowOutOfBounds || columnOutOfBounds;
  }

  private snakeHitsBody() {
    const snakeBody = this.snake.bodyCoordinates.slice(
      0,
      this.snake.length - 1
    );
    const snakeHead = this.snake.headCoordinate;
    const match = snakeBody.some((bodyCoord) =>
      matchCoord(bodyCoord, snakeHead)
    );

    return match;
  }

  private isGameOver() {
    return this.snakeHitsBody() || this.snakeIsOutOfBounds();
  }

  animate(isPlaying: boolean) {
    this.internalPlayState = isPlaying;

    if (this.currentFrameCount < this.staggerFrame) {
      this.currentFrameCount++;
    } else {
      this.currentFrameCount = 0;

      if (this.externalScore !== this.score) {
        this.setScore(this.score);
      }

      if (this.isGameOver()) {
        this.setIsGameOver(true);
        return;
      }

      this.context.clearRect(
        0,
        0,
        this.boardSidesLength,
        this.boardSidesLength
      );
      this.renderBoard();
      this.snake.move(this.foodCoordinate);
    }

    this.internalPlayState &&
      requestAnimationFrame(() => this.animate(this.internalPlayState));
  }
}
