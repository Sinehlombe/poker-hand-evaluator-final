/**
 * Poker Hand Evaluator - Pair Detection
 * 
 * Now with pair, three of a kind, four of a kind, and full house detection.
 */

const RANK_VALUES = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
  "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

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
  // Same validation as before
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

// NEW: Helper function to count ranks
function getRankCounts(cards) {
  const counts = {};
  cards.forEach(card => {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  });
  return counts;
}

// NEW: Helper function to get count pattern
function getCountPattern(rankCounts) {
  return Object.values(rankCounts).sort((a, b) => b - a);
}

// UPDATED: Evaluate with pair detection
function evaluateHand(cards) {
  const validation = validateHand(cards);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const rankCounts = getRankCounts(cards);
  const countPattern = getCountPattern(rankCounts);

  // Check for Four of a Kind
  if (countPattern[0] === 4) {
    return {
      rank: HAND_RANKINGS.FOUR_OF_A_KIND,
      handName: "Four of a Kind",
      description: "Four cards of the same rank"
    };
  }

  // Check for Full House
  if (countPattern[0] === 3 && countPattern[1] === 2) {
    return {
      rank: HAND_RANKINGS.FULL_HOUSE,
      handName: "Full House",
      description: "Three of a kind plus a pair"
    };
  }

  // Check for Three of a Kind
  if (countPattern[0] === 3) {
    return {
      rank: HAND_RANKINGS.THREE_OF_A_KIND,
      handName: "Three of a Kind",
      description: "Three cards of the same rank"
    };
  }

  // Check for Two Pair
  if (countPattern[0] === 2 && countPattern[1] === 2) {
    return {
      rank: HAND_RANKINGS.TWO_PAIR,
      handName: "Two Pair",
      description: "Two different pairs"
    };
  }

  // Check for One Pair
  if (countPattern[0] === 2) {
    return {
      rank: HAND_RANKINGS.ONE_PAIR,
      handName: "One Pair",
      description: "Two cards of the same rank"
    };
  }

  // High Card (no matching cards)
  return {
    rank: HAND_RANKINGS.HIGH_CARD,
    handName: "High Card",
    description: "No matching cards"
  };
}

module.exports = {
  evaluateHand,
  validateHand,
  HAND_RANKINGS,
  RANK_VALUES
};
