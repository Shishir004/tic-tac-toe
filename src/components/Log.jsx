function Log({ turns }) {
  return (
    <ol id="log">
      {turns.map((turn, index) => {
        if (!turn.square) return null;

        const { row, col } = turn.square;
        return (
          <li key={index}>
            {turn.player} selected row {row + 1}, column {col + 1}
          </li>
        );
      })}
    </ol>
  );
}
export default Log;
