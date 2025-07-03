import { useState } from "react";

type Player = 'X' | 'O' | null;

export const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (newBoard: Player[]) => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (newBoard.every(cell => cell !== null)) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
  };

  const getGameStatus = () => {
    if (winner) return `Player ${winner} wins!`;
    if (isDraw) return "It's a draw!";
    return `Player ${currentPlayer}'s turn`;
  };

  return (
    <div className="p-6 text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-primary">Tic Tac Toe</h2>
      
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">{getGameStatus()}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-16 h-16 bg-gray-800 border-2 border-gray-600 rounded-lg text-2xl font-bold hover:bg-gray-700 transition-colors flex items-center justify-center"
            disabled={!!cell || !!winner || isDraw}
          >
            {cell && (
              <span className={cell === 'X' ? 'text-primary' : 'text-red-400'}>
                {cell}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="bg-primary hover:bg-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        New Game
      </button>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Click on any square to place your mark</p>
      </div>
    </div>
  );
};