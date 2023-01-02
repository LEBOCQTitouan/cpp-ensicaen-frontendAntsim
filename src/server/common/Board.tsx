import React, { useEffect, useState } from "react";
import MapCase from "./MapCase";
import { AntMap } from "./utils/Map";
import { Tile } from "./utils/Tile";

const Board: React.FC = (props) => {
  const [json, setJson] = useState<AntMap>();
  const [scaling, setScaling] = useState<number>(0);

  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [startDragX, setDragX] = useState<number>(0);
  const [startDragY, setDragY] = useState<number>(0);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  const fetchData = async () => {
    try {
      fetch('http://0.0.0.0:8080/').then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        console.debug(response);
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
  }, []);

  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    /*
    // handling scroll
    const delta = event.deltaY;
    if (delta > 0) {
      // User is scrolling down (zoom out)
      setScaling(scaling - 0.1);
    } else if (delta < 0) {
      // User is scrolling up (zoom int)
      setScaling(scaling - 0.1);
    }
    */
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setMouseDown(true);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    setMouseDown(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseDown)
      return;
  };

  return (
    <div
      onWheel={handleZoom}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}

      className={"bg-black " +
        "w-full h-full aspect-square " +
        "inline-block " +
        "overflow-hidden " +
        "flex flex-col " +
        "transform-gpu " +
        "scale-" + scaling + " " +
        "translate-x-" + Math.trunc(offsetX) + " " +
        "translate-y-" + Math.trunc(offsetY)}
    >
      {json?.tiles.map((col, i) => {
        return  (
          <div key={"col"+i} className={"flex grow"}>{
            col.map((t, j) => {
              return <MapCase key={"case("+i+","+j+")"} t={t}></MapCase>
            })
          }</div>
        )
      })}
    </div>
  );
}

export default Board;