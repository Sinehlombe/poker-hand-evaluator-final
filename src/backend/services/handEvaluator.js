/**
 * Poker Hand Evaluator - Core Validation
 * 
 * This module validates poker hands and provides basic evaluation.
 */

// Card rank values for comparison
const RANK_VALUES = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
  "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

// Hand rankings (higher number = better hand)
const HAND_RANKINGS = {
  HIGH_CARD: 1,
  ONE_PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL_HOUSE: 7,
  FOUR_OF_A_KIND: 8,
  STRAIGHT_FLUSH: 9,
  ROYAL_FLUSH: 10
};

function validateHand(cards) {
  if (!cards || !Array.isArray(cards)) {
    return { isValid: false, error: "Cards must be an array" };
  }
  
  if (cards.length !== 5) {
    return { isValid: false, error: "A poker hand must contain exactly 5 cards" };
  }
  
  const validRanks = Object.keys(RANK_VALUES);
  const validSuits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    
    if (!card.rank || !card.suit) {
      return { isValid: false, error: `Card ${i + 1} is missing rank or suit` };
    }
    
    if (!validRanks.includes(card.rank)) {
      return { isValid: false, error: `Invalid rank: ${card.rank}` };
    }
    
    if (!validSuits.includes(card.suit)) {
      return { isValid: false, error: `Invalid suit: ${card.suit}` };
    }
  }
  
  const cardStrings = cards.map(c => `${c.rank}_${c.suit}`);
  const uniqueCards = new Set(cardStrings);
  if (uniqueCards.size !== 5) {
    return { isValid: false, error: "Hand contains duplicate cards" };
  }
  
  return { isValid: true, error: null };
}

function evaluateHand(cards) {
  const validation = validateHand(cards);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }
  
  return {
    rank: HAND_RANKINGS.HIGH_CARD,
    handName: "High Card",
    description: "No matching cards"
  };
}

module.exports = { evaluateHand, validateHand, HAND_RANKINGS, RANK_VALUES };
