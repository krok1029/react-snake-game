export type Nullable<T> = T | null;

export interface Coordinate {
  row: number;
  col: number;
}
export enum SnakeMovements {
  Right = 1,
  Left = -1,
  Bottom = 2,
  Top = -2,
}
export enum Cell {
  Snake,
  Food,
  Null,
}
