import React, { useState, useCallback } from 'react';
import { sampleCards } from '../data/sampleCards';

// Shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Create initial player state
const createPlayer = (name, isPlayer = true) => ({
  name,
  isPlayer,
  deck: shuffleArray([...sampleCards, ...sampleCards]), // Double the deck for longer games
  hand: [],
  board: [],
  mana: 1,
  maxMana: 1,
  health: 30
});

export const useGameManager = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0); // 0 = player, 1 = opponent
  const [turnNumber, setTurnNumber] = useState(1);
  const [gamePhase, setGamePhase] = useState('playing'); // 'playing', 'ended'
  const [selectedAttacker, setSelectedAttacker] = useState(null); // { playerIndex, minionIndex }
  
  const [players, setPlayers] = useState([
    createPlayer('Player', true),
    createPlayer('Opponent', false)
  ]);

  // Draw cards from deck to hand
  const drawCards = useCallback((playerIndex, count) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = { ...newPlayers[playerIndex] };
      
      const cardsToDraw = Math.min(count, player.deck.length);
      const drawnCards = player.deck.slice(0, cardsToDraw);
      
      player.deck = player.deck.slice(cardsToDraw);
      player.hand = [...player.hand, ...drawnCards].slice(0, 10); // Max 10 cards in hand
      
      newPlayers[playerIndex] = player;
      return newPlayers;
    });
  }, []);

  // Check if player can afford a card
  const canAfford = useCallback((playerIndex, card) => {
    return players[playerIndex].mana >= card.mana;
  }, [players]);

  // Select a minion as attacker
  const selectAttacker = useCallback((playerIndex, minionIndex) => {
    // If both are null, clear selection
    if (playerIndex === null && minionIndex === null) {
      setSelectedAttacker(null);
      return true;
    }
    
    if (playerIndex !== currentPlayer || !players[playerIndex].isPlayer) return false;
    
    const minion = players[playerIndex].board[minionIndex];
    if (!minion || !minion.canAttack || minion.summoningSickness) return false;
    
    setSelectedAttacker({ playerIndex, minionIndex });
    return true;
  }, [currentPlayer, players]);

  // Attack with selected minion
  const attackTarget = useCallback((targetType, targetPlayerIndex, targetMinionIndex = null) => {
    if (!selectedAttacker) return false;
    
    const attacker = players[selectedAttacker.playerIndex].board[selectedAttacker.minionIndex];
    if (!attacker || !attacker.canAttack) return false;

    setPlayers(prev => {
      const newPlayers = [...prev];
      
      // Get fresh references
      const attackingPlayer = { ...newPlayers[selectedAttacker.playerIndex] };
      const defendingPlayer = { ...newPlayers[targetPlayerIndex] };
      
      // Update attacker
      attackingPlayer.board = [...attackingPlayer.board];
      const attackingMinion = { ...attackingPlayer.board[selectedAttacker.minionIndex] };
      attackingMinion.canAttack = false;
      attackingPlayer.board[selectedAttacker.minionIndex] = attackingMinion;
      
      if (targetType === 'hero') {
        // Attack enemy hero
        defendingPlayer.health -= attackingMinion.attack;
      } else if (targetType === 'minion') {
        // Attack enemy minion
        defendingPlayer.board = [...defendingPlayer.board];
        const defendingMinion = { ...defendingPlayer.board[targetMinionIndex] };
        
        // Deal damage to each other
        defendingMinion.currentHealth -= attackingMinion.attack;
        attackingMinion.currentHealth -= defendingMinion.attack;
        
        // Update defending minion
        defendingPlayer.board[targetMinionIndex] = defendingMinion;
        attackingPlayer.board[selectedAttacker.minionIndex] = attackingMinion;
        
        // Remove dead minions
        defendingPlayer.board = defendingPlayer.board.filter(minion => minion.currentHealth > 0);
        attackingPlayer.board = attackingPlayer.board.filter(minion => minion.currentHealth > 0);
      }
      
      newPlayers[selectedAttacker.playerIndex] = attackingPlayer;
      newPlayers[targetPlayerIndex] = defendingPlayer;
      return newPlayers;
    });
    
    setSelectedAttacker(null);
    return true;
  }, [selectedAttacker, players]);

  // Reset minion states at start of turn
  const resetMinionStates = useCallback((playerIndex) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = { ...newPlayers[playerIndex] };
      
      player.board = player.board.map(minion => ({
        ...minion,
        canAttack: true,
        summoningSickness: false
      }));
      
      newPlayers[playerIndex] = player;
      return newPlayers;
    });
  }, []);

  // Play a card from hand
  const playCard = useCallback((playerIndex, cardIndex) => {
    if (playerIndex !== currentPlayer) return false;
    
    const player = players[playerIndex];
    const card = player.hand[cardIndex];
    
    if (!canAfford(playerIndex, card)) return false;

    setPlayers(prev => {
      const newPlayers = [...prev];
      const newPlayer = { ...newPlayers[playerIndex] };
      
      // Remove card from hand
      newPlayer.hand = newPlayer.hand.filter((_, i) => i !== cardIndex);
      
      // Spend mana
      newPlayer.mana -= card.mana;
      
      // Play the card
      if (card.type === 'Minion') {
        // Add to board if there's space
        if (newPlayer.board.length < 7) {
          newPlayer.board.push({
            ...card, 
            id: `${card.id}_${Date.now()}`,
            canAttack: false,
            summoningSickness: true,
            currentHealth: card.health // Track current health separately
          });
        }
      } else if (card.type === 'Spell') {
        // For now, spells just get discarded after being cast
        console.log(`${card.name} spell cast!`);
        // TODO: Implement spell effects
      }
      
      newPlayers[playerIndex] = newPlayer;
      return newPlayers;
    });
    
    return true;
  }, [currentPlayer, players, canAfford]);

  // End current player's turn
  const endTurn = useCallback(() => {
    const nextPlayer = 1 - currentPlayer;
    
    // Clear any selected attacker
    setSelectedAttacker(null);
    
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = { ...newPlayers[nextPlayer] };
      
      // Increase mana for new turn
      player.maxMana = Math.min(player.maxMana + 1, 10);
      player.mana = player.maxMana;
      
      newPlayers[nextPlayer] = player;
      return newPlayers;
    });
    
    setCurrentPlayer(nextPlayer);
    setTurnNumber(prev => prev + 1);
    
    // Draw a card and reset minion states for the new turn
    setTimeout(() => {
      drawCards(nextPlayer, 1);
      resetMinionStates(nextPlayer);
    }, 500);
  }, [currentPlayer, drawCards, resetMinionStates]);

  // Simple AI opponent logic - separate from endTurn to avoid circular dependency
  const playOpponentTurn = useCallback(() => {
    const opponent = players[1];
    const playableCards = [];
    
    // Find all playable cards
    opponent.hand.forEach((card, index) => {
      if (card.mana <= opponent.mana) {
        playableCards.push({ card, index });
      }
    });
    
    // Sort by mana cost (play higher cost cards first for better strategy)
    playableCards.sort((a, b) => b.card.mana - a.card.mana);
    
    // Play cards with small delays to simulate thinking
    playableCards.forEach((item, i) => {
      setTimeout(() => {
        // Check if we still have enough mana (in case previous plays used mana)
        setPlayers(prev => {
          const currentOpponent = prev[1];
          if (currentOpponent.mana >= item.card.mana && currentOpponent.hand.length > item.index) {
            // Find the card index again (might have shifted)
            const cardIndex = currentOpponent.hand.findIndex(c => c.id === item.card.id);
            if (cardIndex !== -1) {
              playCard(1, cardIndex);
            }
          }
          return prev;
        });
      }, (i + 1) * 1000); // 1 second delay between plays
    });
    
    // End opponent turn after all plays
    setTimeout(() => {
      endTurn();
    }, (playableCards.length + 1) * 1000 + 500);
  }, [players, playCard, endTurn]);

  // Effect to handle opponent turns
  React.useEffect(() => {
    if (currentPlayer === 1 && gamePhase === 'playing') {
      // If it's the opponent's turn, play automatically after a short delay
      const timer = setTimeout(() => playOpponentTurn(), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gamePhase, playOpponentTurn]);

  // Initialize game
  const startGame = useCallback(() => {
    // Reset players
    setPlayers([
      createPlayer('Player', true),
      createPlayer('Opponent', false)
    ]);
    setCurrentPlayer(0);
    setTurnNumber(1);
    setGamePhase('playing');
    
    // Draw initial hands
    setTimeout(() => {
      drawCards(0, 3); // Player draws 3
      drawCards(1, 3); // Opponent draws 3
    }, 100);
  }, [drawCards]);

  return {
    players,
    currentPlayer,
    turnNumber,
    gamePhase,
    selectedAttacker,
    drawCards,
    playCard,
    endTurn,
    canAfford,
    startGame,
    selectAttacker,
    attackTarget,
    resetMinionStates
  };
}; 