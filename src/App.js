import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, values, onPlay }) {
  function handleClick(i) {
    /* if current square value is not null OR a winning row is true, stop */
    if (values[i] || calculateWinner(values)) {
      return;
    }

    /* clone the array of value elements */
    const valuesClone = values.slice();
    console.log("valuesClone", valuesClone);

    if (xIsNext) {
      valuesClone[i] = "X";
    } else {
      valuesClone[i] = "O";
    }
    onPlay(valuesClone);
  }

  /* if winning row exists, declare a winner; else tell me who is next */
  const winningRow = calculateWinner(values);
  console.log("winningRow", winningRow);
  let status;
  if (winningRow) {
    const winner = values[winningRow[0]];
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={values[0]} onSquareClick={() => handleClick(0)} />
        <Square value={values[1]} onSquareClick={() => handleClick(1)} />
        <Square value={values[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={values[3]} onSquareClick={() => handleClick(3)} />
        <Square value={values[4]} onSquareClick={() => handleClick(4)} />
        <Square value={values[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={values[6]} onSquareClick={() => handleClick(6)} />
        <Square value={values[7]} onSquareClick={() => handleClick(7)} />
        <Square value={values[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  console.log("history", history);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0; // current move is even, x is next
  const currentValues = history[currentMove];

  function handlePlay(valuesClone) {
    /* spread the history array from move zero to now, then add the latest value history to the end */
    const currentHistory = [...history.slice(0, currentMove + 1), valuesClone];
    setHistory(currentHistory);
    setCurrentMove(currentHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_values, move) => {
    console.log("moves values", _values);
    console.log("move", move);
    let description;
    if (currentMove === move) {
      description = "You are at move #" + move;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} values={currentValues} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(values) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (values[a] && values[a] === values[b] && values[a] === values[c]) {
      return lines[i];
    }
  }
  return null;
}
