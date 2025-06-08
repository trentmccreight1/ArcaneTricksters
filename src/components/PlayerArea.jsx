import React from 'react';
import Card from './Card';

const PlayerArea = ({ 
  player, 
  playerIndex, 
  isCurrentPlayer, 
  onPlayCard, 
  canAfford,
  selectedAttacker,
  onAttackTarget
}) => {
  const handleCardClick = (cardIndex) => {
    if (isCurrentPlayer && player.isPlayer) {
      onPlayCard(playerIndex, cardIndex);
    }
  };

  const handleHeroClick = () => {
    if (selectedAttacker && selectedAttacker.playerIndex !== playerIndex) {
      onAttackTarget('hero', playerIndex);
    }
  };

  const isValidHeroTarget = selectedAttacker && selectedAttacker.playerIndex !== playerIndex;

  return (
    <div className={`p-4 ${player.isPlayer ? 'bg-blue-900/20' : 'bg-red-900/20'} rounded-lg`}>
      {/* Player Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <h2 className={`text-xl font-fantasy font-bold ${
            player.isPlayer ? 'text-blue-300' : 'text-red-300'
          }`}>
            {player.name}
          </h2>
          
          {/* Health */}
          <div 
            className={`flex items-center rounded-full px-3 py-1 transition-all duration-200 ${
              isValidHeroTarget 
                ? 'bg-red-400 ring-4 ring-red-400/50 cursor-pointer hover:bg-red-300' 
                : 'bg-red-600'
            }`}
            onClick={isValidHeroTarget ? handleHeroClick : undefined}
          >
            <span className="text-white font-bold">❤️ {player.health}</span>
            {isValidHeroTarget && (
              <span className="ml-2 text-yellow-300">🎯</span>
            )}
          </div>
          
          {/* Mana */}
          <div className="flex items-center bg-blue-600 rounded-full px-3 py-1">
            <span className="text-white font-bold">💎 {player.mana}/{player.maxMana}</span>
          </div>
          
          {/* Deck Count */}
          <div className="flex items-center bg-gray-600 rounded-full px-3 py-1">
            <span className="text-white font-bold">📚 {player.deck.length}</span>
          </div>
        </div>
        
        {/* Turn Indicator */}
        {isCurrentPlayer && (
          <div className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold animate-pulse">
            Current Turn
          </div>
        )}
      </div>

      {/* Hand Cards */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {player.hand.map((card, index) => (
          <div key={`${card.id}_${index}`} className="flex-shrink-0">
            <div className="relative">
              <Card 
                card={card} 
                onClick={() => handleCardClick(index)}
                scale={0.8}
              />
              
              {/* Affordability Indicator */}
              {!canAfford(playerIndex, card) && (
                <div className="absolute inset-0 bg-red-500/50 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">No Mana</span>
                </div>
              )}
              
              {/* Playable Indicator */}
              {isCurrentPlayer && player.isPlayer && canAfford(playerIndex, card) && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Empty Hand Message */}
        {player.hand.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 font-fantasy">
            No cards in hand
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerArea; 