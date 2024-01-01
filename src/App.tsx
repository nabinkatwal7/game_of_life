import React, {useCallback} from 'react';
import {useState, useRef} from "react";
import useInterval from "./useInterval";

import './App.css';

const numRows:number = 25;
const numCols:number = 35;

const positions = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];

const generateEmptyGrid = (): number[][] => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
};

const randomTiles = (): number[][] => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
    }
    return rows;
};
function App() {
    const [count, setCount] = useState(0);
    const [grid, setGrid] = useState(() => {
        return randomTiles();
    });

    const [running, setRunning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback((grid:any) => {
        if (!runningRef.current) {
            return;
        }

        let gridCopy = JSON.parse(JSON.stringify(grid));

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                let neighbors = 0;

                positions.forEach(([x, y]) => {
                    const newI = i + x;
                    const newJ = j + y;

                    if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                        neighbors += grid[newI][newJ];
                    }
                });
                setCount(count+1)
                if (neighbors < 2 || neighbors > 3) {
                    gridCopy[i][j] = 0;
                } else if (grid[i][j] === 0 && neighbors === 3) {
                    gridCopy[i][j] = 1;
                }
            }
        }

        setGrid(gridCopy);
    }, []);

    useInterval(() => {
        runSimulation(grid);
    }, 150);


  return (
      <div className="App" >
          <h1>Conway's Game of Life</h1>
          <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 20px)`,
              width: 'fit-content',
              margin: '0 auto'
          }}>
              {grid?.map((rows, i) => (
                  rows?.map((col, k) => (
                      <div key={`${i}-${k}`}
                           onClick={() => {
                               let newGrid = JSON.parse(JSON.stringify(grid));
                               newGrid[i][k] = grid[i][k] ? 0 : 1;
                               setGrid(newGrid);
                           }}
                           style={{
                               width: 20,
                               height: 20,
                               backgroundColor: grid[i][k] ? '#f68e5f' : undefined,
                               border: '1px solid #595959'
                           }}></div>
                  ))
              ))}
          </div>
          <div>Simulation count:{count}</div>
          <div className="button-container" >
              <button

                  onClick={() => {
                      setRunning(!running);
                      if (!running) {
                          runningRef.current = true;
                      }
                      setInterval(() => {
                          runSimulation(grid);
                      }, 1000);
                  }}
              >
                  {running ? "Stop" : "Start"}
              </button>
              <button

                  onClick={() => {
                      setGrid(generateEmptyGrid());
                  }}
              >
                  Clear board
              </button>
              <button
                  onClick={() => {
                      setGrid(randomTiles());
                  }}
              >
                  Random
              </button>
          </div>
      </div>
  );
}

export default App;
