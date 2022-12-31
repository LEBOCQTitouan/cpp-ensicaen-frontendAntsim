import React, { useEffect, useState } from "react";
import MapCase from "./MapCase";
import { AntMap } from "./utils/Map";
import { Tile } from "./utils/Tile";

const Board: React.FC = (props) => {
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
    fetchData().then(r => {return;});
  }, []);

  return (
    <div
      className={"bg-black w-full h-full inline-block aspect-square flex flex-col"}
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