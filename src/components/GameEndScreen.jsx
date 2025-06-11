import React from 'react';

const GameEndScreen = ({ winner, onRestart, players }) => {
  const isPlayerWin = winner === 'player';
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`
        max-w-2xl mx-4 p-8 rounded-2xl border-4 text-center transform transition-all duration-500
        ${isPlayerWin 
          ? 'bg-gradient-to-br from-green-900 to-green-700 border-green-400' 
          : 'bg-gradient-to-br from-red-900 to-red-700 border-red-400'
        }
      `}>
        {/* Victory/Defeat Icon */}
        <div className="text-8xl mb-4 animate-bounce">
          {isPlayerWin ? '🏆' : '💀'}
        </div>
        
        {/* Main Message */}
        <h1 className={`
          text-6xl font-fantasy font-bold mb-4 animate-pulse
          ${isPlayerWin ? 'text-yellow-300' : 'text-red-300'}
        `}>
          {isPlayerWin ? 'VICTORY!' : 'DEFEAT!'}
        </h1>
        
        {/* Subtitle */}
        <p className={`
          text-2xl font-semibold mb-6
          ${isPlayerWin ? 'text-green-200' : 'text-red-200'}
        `}>
          {isPlayerWin 
            ? 'Congratulations! You have triumphed!' 
            : 'Your enemy has bested you in battle!'
          }
        </p>
        
        {/* Game Stats */}
        <div className="bg-black/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-fantasy font-bold text-white mb-4">Final Stats</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${isPlayerWin ? 'bg-green-800/50' : 'bg-gray-800/50'}`}>
              <h4 className={`font-bold text-lg ${isPlayerWin ? 'text-green-300' : 'text-gray-300'}`}>
                Player {isPlayerWin ? '(Winner)' : '(Defeated)'}
              </h4>
              <div className="text-white space-y-1 mt-2">
                <div>❤️ Health: {players[0].health}</div>
                <div>🃏 Cards in Hand: {players[0].hand.length}</div>
                <div>⚔️ Minions on Board: {players[0].board.length}</div>
                <div>📚 Cards in Deck: {players[0].deck.length}</div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${!isPlayerWin ? 'bg-green-800/50' : 'bg-gray-800/50'}`}>
              <h4 className={`font-bold text-lg ${!isPlayerWin ? 'text-green-300' : 'text-gray-300'}`}>
                Opponent {!isPlayerWin ? '(Winner)' : '(Defeated)'}
              </h4>
              <div className="text-white space-y-1 mt-2">
                <div>❤️ Health: {players[1].health}</div>
                <div>🃏 Cards in Hand: {players[1].hand.length}</div>
                <div>⚔️ Minions on Board: {players[1].board.length}</div>
                <div>📚 Cards in Deck: {players[1].deck.length}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onRestart}
            className={`
              w-full px-8 py-4 rounded-xl font-fantasy font-bold text-xl
              transition-all duration-300 transform hover:scale-105
              ${isPlayerWin 
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-400/50' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-400/50'
              }
            `}
          >
            ⚔️ Battle Again ⚔️
          </button>
          
          <p className="text-gray-300 text-sm">
            Click to start a new game and test your deck building skills!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameEndScreen; 