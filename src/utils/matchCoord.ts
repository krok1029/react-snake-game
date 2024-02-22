import { Coordinate } from "@/types";
const matchCoord = (source: Coordinate, target: Coordinate) => {
  return source.col === target.col && source.row === target.row;
};

export default matchCoord;
