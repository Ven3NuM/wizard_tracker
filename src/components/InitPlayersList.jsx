import InitPlayer from './InitPlayer'

function InitPlayersList({ players, onPlayerNameChange }) {
  return (
    <div className="init_players">
      <ul id="listOfPlayers">
        {players.map((playerName, index) => (
          <InitPlayer
            key={index}
            playerNumber={index + 1}
            playerName={playerName}
            onChange={(name) => onPlayerNameChange(index, name)}
          />
        ))}
      </ul>
    </div>
  )
}

export default InitPlayersList
