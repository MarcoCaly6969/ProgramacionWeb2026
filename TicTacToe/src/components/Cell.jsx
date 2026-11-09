import React from 'react';

const Cell = ({ value, onClick, isWinningCell }) => {
  return (
    <button 
      className={`cell ${isWinningCell ? 'cell-winner' : ''}`} 
      onClick={onClick}
      disabled={value !== null}
      aria-label={value ? `Casilla ocupada por ${value}` : "Casilla vacía"}
    >
      {value}
    </button>
  );
};

export default Cell;