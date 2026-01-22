/**
 * Poker Hand Evaluator - Complete Implementation
 * 
 * Now with all 10 poker hand rankings including flush, straight, and royal flush.
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

function getRankCounts(cards) {
  const counts = {};
  cards.forEach(card => {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  });
  return counts;
}

function getCountPattern(rankCounts) {
  return Object.values(rankCounts).sort((a, b) => b - a);
}

// NEW: Flush detection
function isFlush(cards) {
  const firstSuit = cards[0].suit;
  return cards.every(card => card.suit === firstSuit);
}

// NEW: Straight detection
function isStraight(cards) {
  const values = cards.map(card => RANK_VALUES[card.rank]).sort((a, b) => a - b);
  
  // Regular straight
  let isConsecutive = true;
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }
  if (isConsecutive) return true;
  
  // Ace-low straight (wheel)
  const isWheel = values[0] === 2 && values[1] === 3 && 
                  values[2] === 4 && values[3] === 5 && values[4] === 14;
  return isWheel;
}

// NEW: Get highest card
function getHighCard(cards) {
  return Math.max(...cards.map(card => RANK_VALUES[card.rank]));
}

function evaluateHand(cards) {
  const validation = validateHand(cards);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const rankCounts = getRankCounts(cards);
  const countPattern = getCountPattern(rankCounts);
  const flush = isFlush(cards);
  const straight = isStraight(cards);
  const highCard = getHighCard(cards);

  // Check for Royal Flush
  if (flush && straight && highCard === 14) {
    const sortedRanks = cards.map(c => RANK_VALUES[c.rank]).sort((a, b) => b - a);
    if (sortedRanks[0] === 14 && sortedRanks[4] === 10) {
      return {
        rank: HAND_RANKINGS.ROYAL_FLUSH,
        handName: "Royal Flush",
        description: "A-K-Q-J-10 of the same suit - the best possible hand!"
      };
    }
  }

  // Check for Straight Flush
  if (flush && straight) {
    return {
      rank: HAND_RANKINGS.STRAIGHT_FLUSH,
      handName: "Straight Flush",
      description: "Five consecutive cards of the same suit"
    };
  }

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

  // Check for Flush
  if (flush) {
    return {
      rank: HAND_RANKINGS.FLUSH,
      handName: "Flush",
      description: "Five cards of the same suit"
    };
  }

  // Check for Straight
  if (straight) {
    return {
      rank: HAND_RANKINGS.STRAIGHT,
      handName: "Straight",
      description: "Five consecutive cards of different suits"
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

  // High Card
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
