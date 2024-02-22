import matchCoord from "@/utils/matchCoord";
import { Coordinate, SnakeMovements } from "@/types";

export default class Snake {
  private movement: SnakeMovements;
  private _headCoordinate: Coordinate;
  private _bodyCoordinates: Coordinate[];
  private allowMovementChange: boolean;
  justAte: boolean;
  readonly defaultlength: number;

  constructor() {
    this.movement = SnakeMovements.Right;
    this._bodyCoordinates = [];
    this.defaultlength = 3;
    this._headCoordinate = {
      row: -1,
      col: -1,
    };
    this.allowMovementChange = true;
    this.justAte = false;
  }

  get length() {
    return this._bodyCoordinates.length;
  }

  get bodyCoordinates() {
    if (this._bodyCoordinates.length === 0) {
      const initialPoint: Coordinate = {
        row: 1,
        col: 1,
      };
      for (let i = 1; i <= this.defaultlength; i++) {
        this._bodyCoordinates.push({
          row: initialPoint.row,
          col: initialPoint.col * i,
        });
      }
    }
    return this._bodyCoordinates;
  }

  private set bodyCoordinates(newSnakeCoords: Coordinate[]) {
    this._bodyCoordinates = newSnakeCoords;
  }

  get headCoordinate() {
    if (this._headCoordinate.row < 0 || this._headCoordinate.col < 0) {
      this._headCoordinate = this.bodyCoordinates[this.length - 1];
    }

    return this._headCoordinate;
  }

  private set headCoordinate(newCoord: Coordinate) {
    this._headCoordinate = newCoord;
  }

  changeMovement(newMove: SnakeMovements) {
    if (!this.allowMovementChange) {
      return;
    }

    const moveOpposite = newMove + this.movement === 0;

    if (moveOpposite) {
      return;
    }

    this.movement = newMove;
    this.allowMovementChange = false;
  }

  private canEat(nextHead: Coordinate, foodCoord: Coordinate) {
    return matchCoord(nextHead, foodCoord);
  }

  move(foodCoord: Coordinate) {
    let nextHead: Coordinate = { ...this.headCoordinate };

    switch (this.movement) {
      case SnakeMovements.Right:
        nextHead = {
          ...nextHead,
          col: this.headCoordinate.col + 1,
        };
        break;
      case SnakeMovements.Left:
        nextHead = {
          ...nextHead,
          col: this.headCoordinate.col - 1,
        };
        break;
      case SnakeMovements.Top:
        nextHead = {
          ...nextHead,
          row: this.headCoordinate.row - 1,
        };
        break;
      case SnakeMovements.Bottom:
        nextHead = {
          ...nextHead,
          row: this.headCoordinate.row + 1,
        };
        break;
      default:
        throw new Error(`Snake movement is invalid: ${this.movement}`);
    }
    if (this.canEat(nextHead, foodCoord)) {
      const newSnakeCoordinates = [...this.bodyCoordinates];
      this.headCoordinate = nextHead;
      newSnakeCoordinates.push(this.headCoordinate);
      this.bodyCoordinates = newSnakeCoordinates;
      this.allowMovementChange = true;
      this.justAte = true;
    } else {
      const newSnakeCoordinates = this.bodyCoordinates.slice(1);
      this.headCoordinate = nextHead;
      newSnakeCoordinates.push(this.headCoordinate);
      this.bodyCoordinates = newSnakeCoordinates;
      this.allowMovementChange = true;
      this.justAte = false;
    }
  }
}
