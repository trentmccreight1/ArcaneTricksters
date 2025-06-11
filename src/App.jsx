import React, { useEffect } from 'react'
import { useGameManager } from './hooks/useGameManager'
import PlayerArea from './components/PlayerArea'
import BoardArea from './components/BoardArea'
import GameControls from './components/GameControls'
import GameEndScreen from './components/GameEndScreen'

function App() {
  const {
    players,
    currentPlayer,
    turnNumber,
    gamePhase,
    winner,
    selectedAttacker,
    playCard,
    endTurn,
    canAfford,
    startGame,
    selectAttacker,
    attackTarget,
    resetMinionStates
  } = useGameManager();

  // Start the game when the component mounts
  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="min-h-screen py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-fantasy font-bold text-white mb-2">
            Hearthstone Card Battle
          </h1>
          <p className="text-amber-200">
            Click cards to play them, manage your mana, and control the board!
          </p>
          
          {/* Combat Status */}
          {selectedAttacker && (
            <div className="mt-4 p-3 bg-green-900/50 rounded-lg backdrop-blur-sm border border-green-400/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 font-semibold">
                    ⚔️ Attacking with: {players[selectedAttacker.playerIndex].board[selectedAttacker.minionIndex]?.name}
                  </p>
                  <p className="text-green-200 text-sm">
                    Attack enemy minions first, then enemy hero's health (❤️) when no minions remain!
                  </p>
                </div>
                <button
                  onClick={() => selectAttacker && selectAttacker(null, null)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Opponent Area */}
            <PlayerArea
              player={players[1]}
              playerIndex={1}
              isCurrentPlayer={currentPlayer === 1}
              onPlayCard={playCard}
              canAfford={canAfford}
              selectedAttacker={selectedAttacker}
              onAttackTarget={attackTarget}
              enemyBoard={players[1].board}
            />

            {/* Opponent Board */}
            <BoardArea
              playerBoard={players[1].board}
              playerName={players[1].name}
              isPlayer={false}
              playerIndex={1}
              selectedAttacker={selectedAttacker}
              onSelectAttacker={selectAttacker}
              onAttackTarget={attackTarget}
              isCurrentPlayer={currentPlayer === 1}
            />

            {/* Game Board Divider */}
            <div className="text-center py-2">
              <div className="border-t-2 border-amber-400/50"></div>
              <div className="bg-amber-400/10 rounded-full px-4 py-1 inline-block -mt-4">
                <span className="text-amber-300 font-fantasy font-semibold">BATTLEFIELD</span>
              </div>
            </div>

            {/* Player Board */}
            <BoardArea
              playerBoard={players[0].board}
              playerName={players[0].name}
              isPlayer={true}
              playerIndex={0}
              selectedAttacker={selectedAttacker}
              onSelectAttacker={selectAttacker}
              onAttackTarget={attackTarget}
              isCurrentPlayer={currentPlayer === 0}
            />

            {/* Player Area */}
            <PlayerArea
              player={players[0]}
              playerIndex={0}
              isCurrentPlayer={currentPlayer === 0}
              onPlayCard={playCard}
              canAfford={canAfford}
              selectedAttacker={selectedAttacker}
              onAttackTarget={attackTarget}
              enemyBoard={players[0].board}
            />
          </div>

          {/* Game Controls Sidebar */}
          <div className="lg:col-span-1">
            <GameControls
              currentPlayer={currentPlayer}
              turnNumber={turnNumber}
              players={players}
              onEndTurn={endTurn}
              onStartGame={startGame}
            />
          </div>
        </div>

        {/* Game Instructions */}
        <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-xl font-fantasy font-bold text-amber-300 mb-3">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-100">
            <div>
              <h4 className="font-semibold text-amber-200 mb-2">Card Playing</h4>
              <ul className="space-y-1">
                <li>• Click cards in your hand to play them</li>
                <li>• Minions go to your board (max 7)</li>
                <li>• Spells are cast immediately</li>
                <li>• You need enough mana to play cards</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-200 mb-2">Combat System</h4>
              <ul className="space-y-1">
                <li>• Click your minions with ⚔️ to select them</li>
                <li>• <strong>Must attack enemy minions first! 🛡️</strong></li>
                <li>• Can only attack hero when no minions remain</li>
                <li>• <strong>Click enemy health (❤️) when unblocked!</strong></li>
                <li>• Minions deal damage to each other</li>
                <li>• Dead minions (0 health) are removed</li>
                <li>• New minions have summoning sickness 💤</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-200 mb-2">Turn System</h4>
              <ul className="space-y-1">
                <li>• Mana increases each turn (max 10)</li>
                <li>• Draw 1 card at start of turn</li>
                <li>• Minions can attack after first turn</li>
                <li>• Win by reducing enemy health to 0!</li>
                <li>• Click "End Turn" when finished</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Game End Screen Overlay */}
      {gamePhase === 'ended' && winner && (
        <GameEndScreen
          winner={winner}
          onRestart={startGame}
          players={players}
        />
      )}
    </div>
  )
}

export default App 