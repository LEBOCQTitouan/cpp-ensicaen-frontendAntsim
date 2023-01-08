import { Food } from "./Food";
import { Ant } from "./Ant";
import { TileType } from "./enums/TileType";

export interface Tile {
  ants?: Ant[];
  type: TileType;
  discovered: boolean;
}