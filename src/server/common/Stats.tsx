import { FC, useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { AntType } from "./utils/enums/AntType";

const getMaxSize = () : number => {
  if (document.body.clientWidth > document.body.clientHeight)
    return document.body.clientHeight;
  return document.body.clientWidth;
}

const getColor = (type: AntType) : string => {
  switch (type) {
    case AntType.QUEEN:
      return "#0000FF";
    case AntType.WORKER:
      return "#808080"
    case AntType.SOLDIER:
      return "#FF0000";
    case AntType.SCOUT:
      return "#A020F0";
  }
  return "";
}

interface StatsData {
  QUEEN?: number;
  WORKER?: number;
  SOLDIER?: number;
  SCOUT?: number;
}

interface entryLabel {
  name : string;
}
const renderCustomizedLabel = (entry: entryLabel) => {
  return entry.name;
};

const Stats : FC = () => {

  const [json, setJson] = useState<StatsData>();
  const refreshingRateApi = 10000;

  const fetchData = async () => {
    try {
      fetch('http://0.0.0.0:8080/stats/').then(response => {
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

  const data = [];

  if (json) {
    /* QUEEN */
    if (json.QUEEN) {
      data.push({name:"QUEEN", value: json.QUEEN});
    } else {
      data.push({name:"QUEEN", value: 0});
    }
    /* WORKER */
    if (json.WORKER) {
      data.push({name:"WORKER", value: json.WORKER});
    } else {
      data.push({name:"WORKER", value: 0});
    }
    /* SOLDIER */
    if (json.SOLDIER) {
      data.push({name:"SOLDIER", value: json.SOLDIER});
    } else {
      data.push({name:"SOLDIER", value: 0});
    }
    /* SCOUT */
    if (json.SCOUT) {
      data.push({name:"SCOUT", value: json.SCOUT});
    } else {
      data.push({name:"SCOUT", value: 0});
    }
  }

  return (
    <div
      className={"w-screen h-screen inline-block absolute top-0 left-0 bg-white flex items-center justify-center"}
    >
      {json &&
        <ResponsiveContainer>
          <PieChart width={getMaxSize()} height={getMaxSize()}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColor(index)}
                />
              ))}
            </Pie>
            <Legend layout="horizontal" verticalAlign="top" align="center" />
          </PieChart>
        </ResponsiveContainer>
      }
    </div>
  )
}

export default Stats;