import React from 'react';

const MoveHistory = ({ history }) => {
  return (
    <aside className="history-container">
      <h2 className="history-title">Historial de movimientos</h2>
      {history.length === 0 ? (
        <p className="history-empty">Sin movimientos registrados</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.moveNumber} className="history-item">
              <span className="move-number">#{item.moveNumber}:</span>{' '}
              <span className="move-detail">
                Jugador <strong>{item.player}</strong> → Fila {item.row}, Columna {item.col}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default MoveHistory;