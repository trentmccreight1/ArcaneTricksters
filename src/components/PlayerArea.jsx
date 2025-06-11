import React from 'react';
import Card from './Card';

const PlayerArea = ({ 
  player, 
  playerIndex, 
  isCurrentPlayer, 
  onPlayCard, 
  canAfford,
  selectedAttacker,
  onAttackTarget,
  enemyBoard // This should be the defending player's own board for blocking
}) => {
  const handleCardClick = (cardIndex) => {
    if (isCurrentPlayer && player.isPlayer) {
      onPlayCard(playerIndex, cardIndex);
    }
  };

  const handleHeroClick = () => {
    // Only allow hero attacks if there are no blocking minions on this player's board
    const hasBlockingMinions = enemyBoard && enemyBoard.length > 0;
    
    console.log(`Hero click - Player: ${player.name}, Blocking minions: ${hasBlockingMinions ? enemyBoard.length : 0}`, {
      selectedAttacker,
      playerIndex,
      enemyBoard: enemyBoard?.length,
      hasBlockingMinions
    });
    
    if (selectedAttacker && selectedAttacker.playerIndex !== playerIndex && !hasBlockingMinions) {
      onAttackTarget('hero', playerIndex);
    }
  };

  // Check if this hero can be targeted (no blocking minions on this player's board)
  const hasBlockingMinions = enemyBoard && enemyBoard.length > 0;
  const isValidHeroTarget = selectedAttacker && 
                           selectedAttacker.playerIndex !== playerIndex && 
                           !hasBlockingMinions;

  // Debug logging when selectedAttacker changes
  React.useEffect(() => {
    if (selectedAttacker && selectedAttacker.playerIndex !== playerIndex) {
      console.log(`${player.name} hero targeting check:`, {
        selectedAttacker,
        playerIndex,
        enemyBoardLength: enemyBoard?.length || 0,
        hasBlockingMinions,
        isValidHeroTarget
      });
    }
  }, [selectedAttacker, playerIndex, enemyBoard, hasBlockingMinions, isValidHeroTarget, player.name]);

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
          
          {/* Health - Enhanced Hero Portrait */}
          <div 
            className={`relative flex items-center rounded-full px-4 py-2 transition-all duration-200 ${
              isValidHeroTarget 
                ? 'bg-red-400 ring-4 ring-red-400/50 cursor-pointer hover:bg-red-300 scale-110 animate-pulse border-4 border-yellow-400' 
                : hasBlockingMinions && selectedAttacker && selectedAttacker.playerIndex !== playerIndex
                ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                : 'bg-red-600'
            }`}
            onClick={isValidHeroTarget ? handleHeroClick : undefined}
            title={
              isValidHeroTarget 
                ? "Click to attack enemy hero!" 
                : hasBlockingMinions && selectedAttacker && selectedAttacker.playerIndex !== playerIndex
                ? "Cannot attack hero - enemy has blocking minions!"
                : `${player.name} Health`
            }
          >
            <span className="text-white font-bold text-lg">❤️ {player.health}</span>
            {isValidHeroTarget && (
              <>
                <span className="ml-2 text-yellow-300 text-lg animate-bounce">🎯</span>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-ping">
                  ATTACK!
                </div>
                <div className="absolute inset-0 bg-red-300/30 rounded-full animate-pulse"></div>
              </>
            )}
            {hasBlockingMinions && selectedAttacker && selectedAttacker.playerIndex !== playerIndex && (
              <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                BLOCKED
              </div>
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

      {/* Hero Attack Instruction Banner */}
      {isValidHeroTarget && (
        <div className="mb-4 p-3 bg-red-900/70 border-2 border-red-400 rounded-lg">
          <div className="flex items-center justify-center text-center">
            <span className="text-red-300 font-bold text-lg animate-bounce">⚔️</span>
            <span className="text-white font-semibold mx-2">
              Click the enemy health (❤️) to attack {player.name} directly!
            </span>
            <span className="text-red-300 font-bold text-lg animate-bounce">⚔️</span>
          </div>
        </div>
      )}

      {/* Blocking Minions Warning */}
      {hasBlockingMinions && selectedAttacker && selectedAttacker.playerIndex !== playerIndex && (
        <div className="mb-4 p-3 bg-yellow-900/70 border-2 border-yellow-600 rounded-lg">
          <div className="flex items-center justify-center text-center">
            <span className="text-yellow-300 font-bold text-lg">🛡️</span>
            <span className="text-white font-semibold mx-2">
              {player.name} has {enemyBoard.length} blocking minion{enemyBoard.length > 1 ? 's' : ''} - attack them first!
            </span>
            <span className="text-yellow-300 font-bold text-lg">🛡️</span>
          </div>
        </div>
      )}

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