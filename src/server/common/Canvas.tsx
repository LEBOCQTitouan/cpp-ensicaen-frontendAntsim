import React, { useEffect, useRef, useState } from "react";
import { wait } from "next/dist/build/output/log";
import { AntMap } from "./utils/Map";
import { Tile } from "./utils/Tile";
import { TileType } from "./utils/enums/TileType";

const getMetric = (canvas: HTMLCanvasElement | null, nb_elements : number) : number => {
  if (canvas == null) {
    return 0;
  }
  if (canvas.height > canvas.width) {
    return canvas.width / nb_elements;
  }
  return canvas.height / nb_elements;
}

const getTileImages = (tile: Tile) : string[] => {
  const srcs: string[] = [];
  switch (tile.type){
    case TileType.ROCK:
      srcs.push("/canvas/Rock.png")
      break;
    case TileType.COLONY:
      srcs.push("/canvas/Ground.png")
      break;
    case TileType.DEFAULT:
      srcs.push("/canvas/Ground.png")
      break;
  }
  if (tile.ants && tile.ants.length > 0) { // todo differentiate ants
    srcs.push("/canvas/ants/Ant.png");
  }
  return srcs;
}

const drawTile = (canvas: HTMLCanvasElement | null, tile: Tile | undefined, offsetx: number, offsety: number, metric: number): void => {
  if (canvas == null || tile == undefined) {
    return;
  }

  const context: CanvasRenderingContext2D = canvas.getContext('2d');
  for (const tileImage of getTileImages(tile)) {
    const img: HTMLImageElement = new Image();
    img.src = tileImage;
    img.onload = () => {
      context.drawImage(img, offsetx*metric, offsety*metric, metric, metric);
    }
  }
}

const Canvas: React.FC = (props) => {
  const canvasRef = useRef(null);
  const [json, setJson] = useState<AntMap>();

  const fetchData = async () => {
    try {
      fetch('/api/dummy').then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then(data => {
        setJson(data);
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // init the canvas with a white bg
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    // fetchng data from api
    fetchData();
  }, []);

  useEffect(() => {
    if (json == null)
      return;

    const canvas: HTMLCanvasElement | null = canvasRef.current;

    // TODO responsive sizes based on matrix (here is only based on squared matrix)
    console.debug(json)
    for (let i = 0; i < json.tiles.length; i++) {
      for (let j = 0; j < json.tiles[i].length; j++) {
        drawTile(canvas, json.tiles[i][j], i, j, getMetric(canvas, json.tiles.length));
      }
    }
  }, [json])

  return (
    <canvas
      ref={canvasRef}
      className={"bg-black w-full h-full"}
    />
  );
}

export default Canvas;