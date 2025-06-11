import React, { useState, useCallback, useRef } from 'react';
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
  const [winner, setWinner] = useState(null); // 'player', 'opponent', or null
  const cardIdCounter = useRef(0); // Use ref to generate unique IDs
  const attackInProgress = useRef(false); // Prevent duplicate attacks
  const playInProgress = useRef(false); // Prevent duplicate card plays
  const aiTurnActive = useRef(false); // Prevent multiple AI turns
  const aiTimeouts = useRef([]); // Track AI timeouts for cleanup
  
  const [players, setPlayers] = useState([
    createPlayer('Player', true),
    createPlayer('Opponent', false)
  ]);

  // Generate unique card ID
  const generateUniqueId = useCallback((cardId) => {
    cardIdCounter.current += 1;
    return `${cardId}_${Date.now()}_${cardIdCounter.current}`;
  }, []);

  // Check for game end conditions
  const checkGameEnd = useCallback((newPlayers) => {
    if (newPlayers[0].health <= 0) {
      setGamePhase('ended');
      setWinner('opponent');
      console.log('Game Over - Opponent Wins!');
      return true;
    }
    if (newPlayers[1].health <= 0) {
      setGamePhase('ended');
      setWinner('player');
      console.log('Game Over - Player Wins!');
      return true;
    }
    return false;
  }, []);

  // Draw cards from deck to hand
  const drawCards = useCallback((playerIndex, count) => {
    if (gamePhase !== 'playing') return;
    
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
  }, [gamePhase]);

  // Check if player can afford a card
  const canAfford = useCallback((playerIndex, card) => {
    return players[playerIndex].mana >= card.mana;
  }, [players]);

  // Select a minion as attacker
  const selectAttacker = useCallback((playerIndex, minionIndex) => {
    if (gamePhase !== 'playing') return false;
    
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
  }, [currentPlayer, players, gamePhase]);

  // Attack with selected minion
  const attackTarget = useCallback((targetType, targetPlayerIndex, targetMinionIndex = null) => {
    if (gamePhase !== 'playing') return false;
    
    // Prevent duplicate attacks
    if (attackInProgress.current) {
      console.log('Attack already in progress, ignoring duplicate');
      return false;
    }
    
    if (!selectedAttacker) {
      console.log('No attacker selected');
      return false;
    }
    
    const attacker = players[selectedAttacker.playerIndex].board[selectedAttacker.minionIndex];
    if (!attacker || !attacker.canAttack) {
      console.log('Attacker cannot attack:', attacker);
      return false;
    }

    attackInProgress.current = true;
    console.log(`Attack: ${attacker.name} (${attacker.attack} ATK) attacking ${targetType}`, 
                targetType === 'minion' ? `at index ${targetMinionIndex}` : 'hero');

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
        console.log(`Hero takes ${attackingMinion.attack} damage: ${defendingPlayer.health} -> ${defendingPlayer.health - attackingMinion.attack}`);
        defendingPlayer.health -= attackingMinion.attack;
      } else if (targetType === 'minion') {
        // Attack enemy minion
        defendingPlayer.board = [...defendingPlayer.board];
        const defendingMinion = { ...defendingPlayer.board[targetMinionIndex] };
        
        console.log(`Combat: ${attackingMinion.name} (${attackingMinion.attack}/${attackingMinion.currentHealth}) vs ${defendingMinion.name} (${defendingMinion.attack}/${defendingMinion.currentHealth})`);
        
        // Deal damage to each other
        defendingMinion.currentHealth -= attackingMinion.attack;
        attackingMinion.currentHealth -= defendingMinion.attack;
        
        console.log(`After combat: ${attackingMinion.name} (${attackingMinion.currentHealth} HP), ${defendingMinion.name} (${defendingMinion.currentHealth} HP)`);
        
        // Update defending minion
        defendingPlayer.board[targetMinionIndex] = defendingMinion;
        attackingPlayer.board[selectedAttacker.minionIndex] = attackingMinion;
        
        // Remove dead minions
        const beforeDefenderBoard = defendingPlayer.board.length;
        const beforeAttackerBoard = attackingPlayer.board.length;
        
        defendingPlayer.board = defendingPlayer.board.filter(minion => minion.currentHealth > 0);
        attackingPlayer.board = attackingPlayer.board.filter(minion => minion.currentHealth > 0);
        
        if (defendingPlayer.board.length < beforeDefenderBoard) {
          console.log('Defender minion died');
        }
        if (attackingPlayer.board.length < beforeAttackerBoard) {
          console.log('Attacker minion died');
        }
      }
      
      newPlayers[selectedAttacker.playerIndex] = attackingPlayer;
      newPlayers[targetPlayerIndex] = defendingPlayer;
      
      // Check for game end after attack
      checkGameEnd(newPlayers);
      
      return newPlayers;
    });
    
    setSelectedAttacker(null);
    // Reset attack flag after a short delay
    setTimeout(() => {
      attackInProgress.current = false;
    }, 100);
    
    return true;
  }, [selectedAttacker, players, gamePhase, checkGameEnd]);

  // Reset minion states at start of turn
  const resetMinionStates = useCallback((playerIndex) => {
    if (gamePhase !== 'playing') return;
    
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
  }, [gamePhase]);

  // Play a card from hand
  const playCard = useCallback((playerIndex, cardIndex) => {
    // Strict validation checks
    if (gamePhase !== 'playing') {
      console.log('Cannot play card: game not in playing phase');
      return false;
    }
    if (playerIndex !== currentPlayer) {
      console.log(`Cannot play card: not ${playerIndex === 0 ? 'player' : 'opponent'}'s turn (current: ${currentPlayer})`);
      return false;
    }
    
    // Prevent duplicate card plays
    if (playInProgress.current) {
      console.log('Play already in progress, ignoring duplicate');
      return false;
    }
    
    const player = players[playerIndex];
    if (!player) {
      console.log('Invalid player index');
      return false;
    }
    
    const card = player.hand[cardIndex];
    if (!card) {
      console.log('Invalid card index');
      return false;
    }
    
    // Comprehensive mana checking
    if (player.mana < card.mana) {
      console.log(`Cannot play ${card.name}: insufficient mana (have ${player.mana}, need ${card.mana})`);
      return false;
    }

    // Set flag to prevent duplicates
    playInProgress.current = true;
    console.log(`Playing card: ${card.name} (${card.type}) by ${player.name} - Cost: ${card.mana}, Current Mana: ${player.mana}`);

    // Use a single state update to prevent race conditions
    let playSuccess = false;
    setPlayers(prev => {
      const newPlayers = [...prev];
      const newPlayer = { ...newPlayers[playerIndex] };
      
      // Double-check mana in state update (for race conditions)
      if (newPlayer.mana < card.mana) {
        console.log(`Card play cancelled: mana changed during play (${newPlayer.mana} < ${card.mana})`);
        return prev; // Don't update state
      }
      
      // Remove card from hand
      newPlayer.hand = newPlayer.hand.filter((_, i) => i !== cardIndex);
      
      // Spend mana
      newPlayer.mana -= card.mana;
      console.log(`After playing ${card.name}: ${newPlayer.name} mana: ${newPlayer.mana + card.mana} -> ${newPlayer.mana}`);
      
      // Play the card
      if (card.type === 'Minion') {
        // Add to board if there's space
        if (newPlayer.board.length < 7) {
          const minion = {
            ...card, 
            id: generateUniqueId(card.id),
            canAttack: false,
            summoningSickness: true,
            currentHealth: card.health
          };
          newPlayer.board.push(minion);
          console.log(`Minion ${card.name} summoned to ${newPlayer.name}'s board. Board size: ${newPlayer.board.length}`);
        } else {
          console.log(`Board full! Cannot summon ${card.name} for ${newPlayer.name}`);
        }
      } else if (card.type === 'Spell') {
        console.log(`${card.name} spell cast by ${newPlayer.name}! Spell discarded.`);
        // TODO: Implement spell effects
      } else {
        console.warn(`Unknown card type: ${card.type} for card ${card.name}`);
      }
      
      newPlayers[playerIndex] = newPlayer;
      playSuccess = true;
      return newPlayers;
    });
    
    // Reset play flag
    setTimeout(() => {
      playInProgress.current = false;
    }, 50);
    
    return playSuccess;
  }, [currentPlayer, players, generateUniqueId, gamePhase]);

  // Clear AI timeouts helper
  const clearAITimeouts = useCallback(() => {
    aiTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
    aiTimeouts.current = [];
    aiTurnActive.current = false;
  }, []);

  // End current player's turn
  const endTurn = useCallback(() => {
    if (gamePhase !== 'playing') return;
    
    const nextPlayer = 1 - currentPlayer;
    
    // Clear any AI timeouts from previous turn
    clearAITimeouts();
    
    // Clear any selected attacker
    setSelectedAttacker(null);
    // Reset flags
    attackInProgress.current = false;
    playInProgress.current = false;
    
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
  }, [currentPlayer, drawCards, resetMinionStates, gamePhase, clearAITimeouts]);

  // AI opponent logic - completely rewritten for reliability
  const playOpponentTurn = useCallback(() => {
    // Prevent multiple AI turns
    if (aiTurnActive.current || gamePhase !== 'playing' || currentPlayer !== 1) {
      console.log('AI turn blocked: already active or wrong conditions');
      return;
    }
    
    aiTurnActive.current = true;
    console.log('AI Opponent starting turn');
    
    const playNextCard = () => {
      // Abort if conditions changed
      if (gamePhase !== 'playing' || currentPlayer !== 1) {
        console.log('AI turn cancelled: game conditions changed');
        clearAITimeouts();
        return;
      }
      
      // Get fresh opponent state
      setPlayers(prev => {
        const currentOpponent = prev[1];
        console.log(`AI checking: ${currentOpponent.mana} mana, ${currentOpponent.hand.length} cards`);
        
        // Check if AI can play any cards
        if (currentOpponent.mana <= 0) {
          console.log('AI ending turn: no mana');
          const timeoutId = setTimeout(() => {
            if (gamePhase === 'playing' && currentPlayer === 1) {
              endTurn();
            }
          }, 1000);
          aiTimeouts.current.push(timeoutId);
          return prev;
        }
        
        // Find playable cards
        const playableCards = currentOpponent.hand
          .map((card, index) => ({ card, index }))
          .filter(item => item.card.mana <= currentOpponent.mana)
          .sort((a, b) => b.card.mana - a.card.mana);
        
        if (playableCards.length === 0) {
          console.log('AI ending turn: no playable cards');
          const timeoutId = setTimeout(() => {
            if (gamePhase === 'playing' && currentPlayer === 1) {
              endTurn();
            }
          }, 1000);
          aiTimeouts.current.push(timeoutId);
          return prev;
        }
        
        // Play the most expensive card
        const cardToPlay = playableCards[0];
        console.log(`AI attempting: ${cardToPlay.card.name} (${cardToPlay.card.mana} mana)`);
        
        // Schedule the card play
        const timeoutId = setTimeout(() => {
          if (gamePhase === 'playing' && currentPlayer === 1) {
            const success = playCard(1, cardToPlay.index);
            if (success) {
              console.log(`AI played ${cardToPlay.card.name}`);
              // Continue playing after a delay
              const nextTimeoutId = setTimeout(() => {
                if (gamePhase === 'playing' && currentPlayer === 1) {
                  playNextCard();
                }
              }, 2000);
              aiTimeouts.current.push(nextTimeoutId);
            } else {
              console.log('AI play failed, ending turn');
              const endTimeoutId = setTimeout(() => {
                if (gamePhase === 'playing' && currentPlayer === 1) {
                  endTurn();
                }
              }, 500);
              aiTimeouts.current.push(endTimeoutId);
            }
          }
        }, 1000);
        aiTimeouts.current.push(timeoutId);
        
        return prev; // No state change here
      });
    };
    
    // Start AI turn with delay
    const startTimeoutId = setTimeout(() => {
      if (gamePhase === 'playing' && currentPlayer === 1) {
        playNextCard();
      }
    }, 1000);
    aiTimeouts.current.push(startTimeoutId);
    
  }, [gamePhase, currentPlayer, playCard, endTurn, clearAITimeouts]);

  // Effect to handle opponent turns
  React.useEffect(() => {
    if (currentPlayer === 1 && gamePhase === 'playing' && !aiTurnActive.current) {
      console.log('Triggering AI turn from useEffect');
      playOpponentTurn();
    }
  }, [currentPlayer, gamePhase, playOpponentTurn]);

  // Initialize game
  const startGame = useCallback(() => {
    console.log('Starting new game...');
    
    // Clear any ongoing AI operations
    clearAITimeouts();
    
    // Reset all counters and flags
    cardIdCounter.current = 0;
    attackInProgress.current = false;
    playInProgress.current = false;
    aiTurnActive.current = false;
    
    setPlayers([
      createPlayer('Player', true),
      createPlayer('Opponent', false)
    ]);
    setCurrentPlayer(0);
    setTurnNumber(1);
    setGamePhase('playing');
    setWinner(null);
    setSelectedAttacker(null);
    
    // Draw initial hands
    setTimeout(() => {
      drawCards(0, 3); // Player draws 3
      drawCards(1, 3); // Opponent draws 3
    }, 100);
  }, [drawCards, clearAITimeouts]);

  return {
    players,
    currentPlayer,
    turnNumber,
    gamePhase,
    winner,
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