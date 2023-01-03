import React, { useEffect, useRef, useState, WheelEvent, MouseEvent} from "react";
import { AntMap } from "./utils/Map";
import { Tile } from "./utils/Tile";
import { UtilDrawing } from "./UtilCanvas";
import { TileType } from "./utils/enums/TileType";

/**
 * util function used to get a metric used to display as mush element (of same size) as possible on a canvas
 * @param canvas
 * @param n the maximum number of elements on both horizontal and vertical axis
 */
const getCanvasMetric = (canvas : HTMLCanvasElement, n : number) : number => {
  if (canvas.height > canvas.width) {
    return canvas.width / n;
  }
  return canvas.height / n;
}

/**
 * util function used to find the greatest size in all arrays in a matrix (lines and cols)
 * @param matrix
 */
const getMaxArraySizeInMatrix = (matrix : any [][]) : number => {
  let max_size : number = matrix.length;
  for (const arrayElement of matrix) {
    if (arrayElement.length > max_size) {
      max_size = arrayElement.length;
    }
  }
  return max_size
}

/**
 * util function used to find the greatest size in sub arrays in a matrix
 * @param matrix
 */
const getMaxSizeArrayInsideMatrix = (matrix : any[][]) : number => {
  let max_size = 0;
  for (let i = 0; i < matrix.length; i++) {
    const arrayCol : any[] | undefined = matrix[i];
    if (arrayCol != undefined && max_size < arrayCol.length) {
        max_size = arrayCol.length;
    }
  }
  return max_size;
}

const drawTileBackground = (context : CanvasRenderingContext2D, tile : Tile, x : number, y : number, util : UtilDrawing) => {
  switch (tile.type) {
    case TileType.ROCK:
      context.fillStyle = "#808080";
    break;
    case TileType.COLONY:
      context.fillStyle = "#964B00";
      break;
    case TileType.DEFAULT:
      context.fillStyle = "#00FF00"
      break;
  }
  context.fillRect(x, y, util.metric * util.scaling, util.metric * util.scaling);
}
const drawTile = (canvas : HTMLCanvasElement, tile : Tile, x : number, y : number, util : UtilDrawing) : void => {
  const context : CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (context == null)
    return;
  drawTileBackground(context, tile, x, y, util);
}

const drawAntMap = (canvas : HTMLCanvasElement, map : AntMap, util : UtilDrawing) : void => {
  const context : CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (context == null)
    return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff";

  for (let i = 0; i < map.tiles.length; i++) {
    const tileCol : Tile[] | undefined = map.tiles[i];
    if (tileCol != undefined) {
      for (let j = 0; j < tileCol.length; j++) {
        const tile : Tile | undefined = tileCol[j];
        if (tile != undefined) {
          const x : number = i*util.metric*util.scaling + util.offsetX;
          const y : number = j*util.metric*util.scaling + util.offsetY;
          drawTile(canvas, tile, x, y, util);
        }
      }
    }
  }
}

const Board: React.FC = (props) => {
  // TODO update metric on canvas update
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [json, setJson] = useState<AntMap>();

  const [shiftDown, setShiftDown] = useState<boolean>(false);

  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [scaling, setScaling] = useState<number>(1);
  const [metric, setMetric] = useState<number>(0)

  const refreshingRateApi = 10000;

  const fetchData = async () => {
    try {
      fetch('http://0.0.0.0:8080/').then(response => {
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
    fetchData().then(r => {return;});
    const interval = setInterval(() => {
      fetchData().then(r => {return;});
    }, refreshingRateApi);
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const canvas : HTMLCanvasElement | null = canvasRef.current;
    if (canvas == null || json == null)
      return;
    if (metric == 0) {
      const new_metric = getCanvasMetric(canvas, getMaxArraySizeInMatrix(json.tiles));
      setMetric(new_metric);
      setOffsetX(canvas.width/2 - new_metric * json.tiles.length / 2);
      setOffsetY(canvas.height/2 - new_metric * getMaxSizeArrayInsideMatrix(json.tiles) / 2);
    }
    drawAntMap(canvas, json, {metric, offsetX, offsetY, scaling});
  }, [json]);

  const handleWheelEvent = (event : WheelEvent<HTMLCanvasElement>) => {
    if (json == null)
      return;
    if (event.shiftKey) {
      const event_value = (event.deltaX + event.deltaY) / 1000;
      if (event_value + scaling != 0) {
        setScaling(scaling + event_value);
      }
    } else {
      const delta_x = event.deltaX / 10;
      const delta_y = event.deltaY / 10;
      setOffsetX(offsetX + delta_x);
      setOffsetY(offsetY + delta_y);
    }
    const canvas : HTMLCanvasElement | null = canvasRef.current;
    if (canvas == null || json == null)
      return;
    drawAntMap(canvas, json, {metric, offsetX, offsetY, scaling});
  }

  return (
    <canvas
      ref={canvasRef}
      onWheel={handleWheelEvent}
      className={"h-full w-full bg-black"}
    ></canvas>
  );
}

export default Board;