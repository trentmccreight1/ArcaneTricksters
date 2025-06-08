import React from 'react';

const GameControls = ({ 
  currentPlayer, 
  turnNumber, 
  players, 
  onEndTurn, 
  onStartGame 
}) => {
  const currentPlayerData = players[currentPlayer];
  
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
      {/* Game Info */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-fantasy font-bold text-white mb-2">
          Turn {turnNumber}
        </h2>
        <p className="text-amber-200 text-lg">
          {currentPlayerData.name}'s Turn
        </p>
      </div>

      {/* Turn Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onEndTurn}
          disabled={!currentPlayerData.isPlayer}
          className={`
            px-6 py-3 rounded-lg font-fantasy font-bold text-lg transition-all duration-200
            ${currentPlayerData.isPlayer 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          {currentPlayerData.isPlayer ? 'End Turn' : 'Opponent\'s Turn'}
        </button>
        
        <button
          onClick={onStartGame}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-fantasy font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          New Game
        </button>
      </div>

      {/* Quick Game Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-900/50 p-3 rounded">
          <h4 className="font-fantasy font-semibold text-blue-300 mb-1">Player</h4>
          <div className="text-white space-y-1">
            <div>Health: {players[0].health}</div>
            <div>Hand: {players[0].hand.length}</div>
            <div>Board: {players[0].board.length}/7</div>
            <div>Deck: {players[0].deck.length}</div>
          </div>
        </div>
        
        <div className="bg-red-900/50 p-3 rounded">
          <h4 className="font-fantasy font-semibold text-red-300 mb-1">Opponent</h4>
          <div className="text-white space-y-1">
            <div>Health: {players[1].health}</div>
            <div>Hand: {players[1].hand.length}</div>
            <div>Board: {players[1].board.length}/7</div>
            <div>Deck: {players[1].deck.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls; 