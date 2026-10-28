import React, { useState } from 'react';
import Cell from './components/Cell';
import MoveHistory from './components/MoveHistory';
import './App.css';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
  [0, 4, 8], [2, 4, 6]             // Diagonales
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [history, setHistory] = useState([]);

  // Función para determinar ganador y casillas ganadoras
  const checkWinner = (squares) => {
    for (let combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    return null;
  };

  const winInfo = checkWinner(board);
  const winner = winInfo ? winInfo.winner : null;
  const winningLine = winInfo ? winInfo.line : [];
  const isDraw = !winner && board.every((cell) => cell !== null);

  const handleCellClick = (index) => {
    // No hacer nada si la casilla está ocupada o el juego terminó
    if (board[index] || winner) return;

    const currentPlayer = isXNext ? 'X' : 'O';
    
    // Actualizar tablero
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Calcular coordenadas (1-indexado para lectura humana)
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;

    // Registrar movimiento en el historial
    const newMove = {
      moveNumber: history.length + 1,
      player: currentPlayer,
      row,
      col
    };

    setHistory([...history, newMove]);
    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setHistory([]);
  };

  // Determinar texto de estado
  let statusText;
  if (winner) {
    statusText = `Ganador: Jugador ${winner}`;
  } else if (isDraw) {
    statusText = 'Empate';
  } else {
    statusText = `Turno del Jugador ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <main className="app-container">
      <header className="header">
        <h1 className="title">Tres en Raya</h1>
        <p className={`status ${winner ? 'status-winner' : ''}`}>{statusText}</p>
      </header>

      <div className="game-layout">
        <section className="board-section">
          <div className="board">
            {board.map((cellValue, index) => (
              <Cell
                key={index}
                value={cellValue}
                onClick={() => handleCellClick(index)}
                isWinningCell={winningLine.includes(index)}
              />
            ))}
          </div>

          <button className="reset-btn" onClick={handleReset}>
            Reiniciar partida
          </button>
        </section>

        <MoveHistory history={history} />
      </div>
    </main>
  );
}

export default App;