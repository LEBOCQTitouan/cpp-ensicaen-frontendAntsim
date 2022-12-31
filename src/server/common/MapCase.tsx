import React from "react";
import { Tile } from "./utils/Tile";
import { TileType } from "./utils/enums/TileType";
import Image from "next/image";
import { AntType } from "./utils/enums/AntType";
import { Ant } from "./utils/Ant";

interface MapCaseProps {
  t: Tile;
}

const getSrcBackground = (type : TileType) : string => {
  switch (type) {
    case TileType.ROCK:
      return "/canvas/Rock.png";
    case TileType.COLONY:
      return "/canvas/Ground Ant.png";
    case TileType.DEFAULT:
      return "/canvas/Ground.png";
  }
}

const getAntSprite = (type: Ant[]) : string => {
  return "/canvas/ants/Ant.png";
}

const MapCase : React.FC<MapCaseProps> = (props) => {
  const img_classNames = "h-full w-full absolute top-0 left-0";
  return (
    <div
      className={"aspect-square"}
    >
      <div className={"h-full w-full relative inline-block"}>
        <Image
          src={getSrcBackground(props.t.type)}
          alt={"Background of type "+props.t.type}
          width={1000}
          height={1000}
          className={img_classNames}
        ></Image>
        {props.t.food &&
          <Image
            src={"/canvas/Food.png"}
            alt={"Background of type "+props.t.type}
            width={1000}
            height={1000}
            className={img_classNames}
          ></Image>
        }
        {props.t.ants &&
          <Image
            src={getAntSprite(props.t.ants)} // TODO conditionnal display of the ants
            alt={"Background of type "+props.t.type}
            width={1000}
            height={1000}
            className={img_classNames}
          ></Image>
        }
      </div>
    </div>
  )
}

export default MapCase;