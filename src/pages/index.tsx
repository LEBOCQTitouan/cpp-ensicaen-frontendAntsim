import { type NextPage } from "next";
import Head from "next/head";
import MainMenu from "../server/common/Menu";
import Board from "../server/common/Board";
import { useState } from "react";
import Stats from "../server/common/Stats";

const Home: NextPage = () => {

  const [displayStats, setDisplayStats] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Sim ant</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={"h-screen max-h-screen flex flex-col"}>
          {/* <MainMenu></MainMenu> */}
          <div className={""}>
            <Board></Board>
          </div>
        </div>
        {displayStats &&
          <Stats/>
        }
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-5 left-5"
          onClick={() => {
            setDisplayStats(!displayStats)
          }}
        >
          Display stats
        </button>
      </main>
    </>
  );
};

export default Home;
