import { NextApiRequest, NextApiResponse } from 'next';
import { TileType } from "../../server/common/utils/enums/TileType";
import { AntType } from "../../server/common/utils/enums/AntType";

export default function (req: NextApiRequest, res: NextApiResponse) {
  res.statusCode = 200
  res.json({
    tiles: [
      [{type:TileType.ROCK}, {type: TileType.DEFAULT, ants: [{colony: "test", type: AntType.QUEEN}]}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}],
      [{type: TileType.DEFAULT}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}],
      [{type: TileType.DEFAULT}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}],
      [{type: TileType.DEFAULT}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}, {type: TileType.DEFAULT}]
    ]
  })
}