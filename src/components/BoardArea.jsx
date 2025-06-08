import React from 'react';
import Card from './Card';

const BoardArea = ({ 
  playerBoard, 
  playerName, 
  isPlayer, 
  playerIndex,
  selectedAttacker,
  onSelectAttacker,
  onAttackTarget,
  isCurrentPlayer
}) => {
  const handleMinionClick = (minionIndex) => {
    const minion = playerBoard[minionIndex];
    
    if (selectedAttacker) {
      // If we have a selected attacker, try to attack this minion
      if (!isPlayer && selectedAttacker.playerIndex !== playerIndex) {
        onAttackTarget('minion', playerIndex, minionIndex);
      }
    } else {
      // Try to select this minion as attacker
      if (isPlayer && isCurrentPlayer && minion.canAttack && !minion.summoningSickness) {
        onSelectAttacker(playerIndex, minionIndex);
      }
    }
  };

  return (
    <div className={`p-4 border-2 border-dashed ${
      isPlayer ? 'border-blue-400/50' : 'border-red-400/50'
    } rounded-lg min-h-40`}>
      {/* Board Header */}
      <div className="text-center mb-3">
        <h3 className={`font-fantasy font-semibold ${
          isPlayer ? 'text-blue-300' : 'text-red-300'
        }`}>
          {playerName}'s Board ({playerBoard.length}/7)
        </h3>
      </div>

      {/* Minions on Board */}
      <div className="flex justify-center space-x-2 overflow-x-auto">
        {playerBoard.map((minion, index) => {
          const isSelected = selectedAttacker && 
                           selectedAttacker.playerIndex === playerIndex && 
                           selectedAttacker.minionIndex === index;
          
          const canAttackMinion = isPlayer && isCurrentPlayer && 
                                minion.canAttack && !minion.summoningSickness;
          
          const isValidTarget = selectedAttacker && 
                              selectedAttacker.playerIndex !== playerIndex && 
                              !isPlayer;
          
          return (
            <div key={minion.id} className="flex-shrink-0">
              <Card 
                card={minion} 
                scale={0.7}
                onClick={() => handleMinionClick(index)}
                isSelected={isSelected}
                canAttack={canAttackMinion}
                isValidTarget={isValidTarget}
                isDying={minion.currentHealth <= 0}
              />
            </div>
          );
        })}
        
        {/* Empty Board Message */}
        {playerBoard.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-400 font-fantasy">
            <div className="text-center">
              <div className="text-4xl mb-2">🏟️</div>
              <div>No minions on board</div>
            </div>
          </div>
        )}
        
        {/* Board Slots Indicator */}
        {playerBoard.length > 0 && playerBoard.length < 7 && (
          <div className="flex space-x-2">
            {Array.from({ length: 7 - playerBoard.length }).map((_, index) => (
              <div 
                key={index}
                className="w-32 h-40 border-2 border-dashed border-gray-500/30 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500 text-xs">Empty</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardArea; 